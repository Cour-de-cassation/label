import { sum, sumBy, uniq } from 'lodash';
import { promises as fs } from 'fs';
import {
  csvExtractor,
  documentModule,
  documentType,
  idModule,
  treatmentModule,
} from '@label/core';
import { assignationService } from '../../modules/assignation';
import { treatmentService } from '../../modules/treatment';
import { userService } from '../../modules/user';
import { buildDocumentRepository } from '../../modules/document';
import { logger } from '../../utils';

export { extractComplexityInfoIntoCsv };

type complexityInfoType = {
  annotationsCount: Record<typeof categories[number], number>;
  documentId: documentType['_id'];
  documentNumber: documentType['documentNumber'];
  documentSource: documentType['source'];
  isCourDeCassationDecision: boolean;
  uniqueEntitiesCount: number;
  uniqueRepresentativesCount: number;
  occultationBlock: number;
  treatmentDuration: number;
  totalDuration: number;
  userNames: string[];
  wordsCount: number;
};

const categories = [
  'personnePhysique',
  'dateNaissance',
  'dateMariage',
  'dateDeces',
  'insee',
  'professionnelMagistratGreffier',
  'personneMorale',
  'etablissement',
  'numeroSiretSiren',
  'adresse',
  'localite',
  'telephoneFax',
  'email',
  'siteWebSensible',
  'compteBancaire',
  'plaqueImmatriculation',
  'cadastre',
  'professionnelAvocat',
] as const;

async function extractComplexityInfoIntoCsv() {
  logger.log(`extractComplexityInfoIntoCsv`);

  const fileName = 'complexityInfo.csv';

  const documentRepository = buildDocumentRepository();

  const treatedDocuments = await documentRepository.findAllByStatusProjection(
    ['done', 'toBePublished'],
    ['_id', 'documentNumber', 'source', 'text', 'decisionMetadata', 'route'],
  );

  const exhaustiveTreatedDocuments = treatedDocuments.filter(
    ({ route }) => route !== 'automatic',
  );

  const documentIds = exhaustiveTreatedDocuments.map(({ _id }) => _id);
  const assignationsByDocumentId = await assignationService.fetchAssignationsByDocumentIds(
    documentIds,
    {
      assertEveryDocumentIsAssigned: true,
    },
  );

  const usersByIds = await userService.fetchUsers();
  const treatmentsByDocumentId = await treatmentService.fetchTreatmentsByDocumentIds(
    documentIds,
  );

  const complexityInfos = exhaustiveTreatedDocuments.map((treatedDocument) => {
    const documentIdString = idModule.lib.convertToString(treatedDocument._id);
    const assignations = assignationsByDocumentId[documentIdString];

    const treatments = treatmentsByDocumentId[documentIdString];
    const humanTreatments = treatmentModule.lib.extractHumanTreatments(
      treatments,
      assignations,
    );

    const nonHumanTreatments = treatments
      .filter(
        (treatment) =>
          treatment.source === 'NLP' || treatment.source === 'postProcess',
      )
      .sort((treatment1, treatment2) => treatment1.order - treatment2.order);

    if (humanTreatments.length === 0) {
      throw new Error(
        `No human treatment found for document ${documentIdString}`,
      );
    }

    const nonHumanAnnotations = treatmentModule.lib.computeAnnotations(
      nonHumanTreatments,
    );
    const annotationsCount = categories.reduce((accumulator, category) => {
      return {
        ...accumulator,
        [category]: nonHumanAnnotations.filter(
          (annotation) => annotation.category === category,
        ).length,
      };
    }, {} as complexityInfoType['annotationsCount']);

    const cadastreAnnotationsCount = nonHumanAnnotations.filter(
      ({ category }) => category === 'cadastre',
    ).length;

    const isCourDeCassationDecision =
      treatedDocument.decisionMetadata.jurisdiction.trim().toLowerCase() ===
      'cour de cassation';

    const uniqueEntitiesCount = uniq(
      nonHumanAnnotations.map(({ entityId }) => entityId),
    ).length;

    const uniqueRepresentativesCount = uniq(
      nonHumanAnnotations.map(({ text, category }) => `${text}_${category}`),
    ).length;

    const userNames = humanTreatments.map(
      ({ userId }) => usersByIds[idModule.lib.convertToString(userId)].name,
    );
    const treatmentDuration = sumBy(
      humanTreatments,
      ({ treatment }) => treatment.duration,
    );
    const totalDuration = sumBy(
      humanTreatments,
      ({ treatment }) => treatment.duration + treatment.idleDuration,
    );

    return {
      cadastreAnnotationsCount,
      documentId: treatedDocument._id,
      documentNumber: treatedDocument.documentNumber,
      documentSource: treatedDocument.source,
      isCourDeCassationDecision,
      treatmentDuration,
      totalDuration,
      userNames,
      occultationBlock: treatedDocument.decisionMetadata.occultationBlock || 0,
      annotationsCount,
      uniqueEntitiesCount,
      uniqueRepresentativesCount,
      wordsCount: documentModule.lib.countWords(treatedDocument),
    };
  });

  const csvContent = convertComplexityInfosToCsvContent(complexityInfos);

  try {
    await fs.writeFile(`./${fileName}`, csvContent);
  } catch (err) {
    logger.error(err);
  }
}

function convertComplexityInfosToCsvContent(
  complexityInfos: complexityInfoType[],
) {
  const CSV_FIELDS: Array<{
    title: string;
    extractor: (complexityInfo: complexityInfoType) => string;
  }> = [
    {
      title: 'ID document',
      extractor: (complexityInfo) =>
        idModule.lib.convertToString(complexityInfo.documentId),
    },
    {
      title: 'Source document',
      extractor: (complexityInfo) => complexityInfo.documentSource,
    },
    {
      title: 'Document number',
      extractor: (complexityInfo) => complexityInfo.documentNumber.toString(),
    },
    {
      title: 'Usernames',
      extractor: (complexityInfo) => complexityInfo.userNames.join(', '),
    },
    {
      title: 'Nombre de mots',
      extractor: (complexityInfo) => complexityInfo.wordsCount.toString(),
    },
    {
      title: "Nombre d'annotations",
      extractor: (complexityInfo) =>
        sum(Object.values(complexityInfo.annotationsCount)).toString(),
    },
    {
      title: "Nombre d'entités",
      extractor: (complexityInfo) =>
        complexityInfo.uniqueEntitiesCount.toString(),
    },
    {
      title: 'Nombre de représentants',
      extractor: (complexityInfo) =>
        complexityInfo.uniqueRepresentativesCount.toString(),
    },
    {
      title: 'Treatment duration',
      extractor: (complexityInfo) =>
        complexityInfo.treatmentDuration.toString(),
    },
    {
      title: 'Total idle+treatment duration',
      extractor: (complexityInfo) => complexityInfo.totalDuration.toString(),
    },
    {
      title: 'Is Cour de cassation',
      extractor: (complexityInfo) =>
        complexityInfo.isCourDeCassationDecision ? 'TRUE' : 'FALSE',
    },
    {
      title: 'Occultation block',
      extractor: (complexityInfo) => complexityInfo.occultationBlock.toString(),
    },
    ...categories.map((category) => ({
      title: `${category} annotation count`,
      extractor: (complexityInfo: complexityInfoType) =>
        complexityInfo.annotationsCount[category].toString(),
    })),
  ];
  return csvExtractor.convertDataToCsv(
    complexityInfos.filter(
      (complexityInfo) => complexityInfo.userNames.length === 1,
    ),
    CSV_FIELDS,
  );
}
