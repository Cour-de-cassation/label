import { documentModule } from '../../document';
import { idModule } from '../../id';
import { buildStatistic } from './buildStatistic';

const TREATMENT_DATE = new Date(2021, 3, 30, 0, 0, 0);
const checklistMock = [
  {
    checkType: 'different_categories',
    message: "L'annotation 'Yon' est présente dans différentes catégories: ['Magistrat/Greffier', 'Personne physique']",
    entities: [
      {
        text: 'Yon',
        start: 9358,
        category: 'personnePhysique',
        source: 'postprocess',
        score: 1.0,
        entityId: 'personnePhysique_yon',
        end: 9361,
      },
      {
        text: 'Yon',
        start: 6796,
        category: 'professionnelMagistratGreffier',
        source: 'postprocess',
        score: 1.0,
        entityId: 'professionnelMagistratGreffier_yon',
        end: 6799,
      },
    ],
    sentences: [
      {
        start: 0,
        end: 22,
      },
    ],
    metadata_text: [],
  },
];

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('buildStatistic', () => {
  it('should build a new statistic', () => {
    const annotationsCount = 10;
    const documentNumber = 123456;
    const documentExternalId = 'DOCUMENT_EXTERNAL_ID';
    const documentPublicationCategory = ['P'];
    const documentRoute = 'exhaustive';
    const documentImporter = 'recent';
    const documentSource = 'SOURCE';
    const linkedEntitiesCount = 2;
    const jurisdiction = 'Cour de cassation';
    const userId = idModule.lib.buildId();
    const decisionDate = new Date().getTime();
    const document = documentModule.generator.generate({
      decisionMetadata: documentModule.decisionMetadataGenerator.generate({
        additionalTermsToAnnotate: '',
        appealNumber: 'TRUC',
        boundDecisionDocumentNumbers: [],
        categoriesToOmit: [],
        chamberName: 'Chambre criminelle',
        criminalCaseCode: '',
        civilCaseCode: '',
        civilMatterCode: '',
        date: decisionDate,
        jurisdiction,
        NACCode: '',
        endCaseCode: '',
        occultationBlock: undefined,
        parties: [],
        session: 'FRH',
        solution: '',
      }),
      documentNumber,
      externalId: documentExternalId,
      publicationCategory: documentPublicationCategory,
      source: documentSource,
      route: documentRoute,
      importer: documentImporter,
      text: 'Some text with five words',
    });
    const treatmentInfo = {
      subAnnotationsNonSensitiveCount: 1,
      subAnnotationsSensitiveCount: 2,
      surAnnotationsCount: 3,
    };
    const lastUpdateDate = TREATMENT_DATE.getTime();

    const statistic = buildStatistic({
      annotationsCount,
      document,
      linkedEntitiesCount,
      lastUpdateDate,
      treatmentInfo,
      annotationReportsChecklist: checklistMock,
      humanTreatmentsSummary: [{ userId, treatmentDuration: 10 }],
    });

    expect(statistic).toEqual({
      _id: statistic._id,
      annotationsCount,
      appealNumber: 'TRUC',
      chamberName: 'chambre criminelle',
      decisionDate,
      documentExternalId,
      documentNumber,
      jurisdiction: 'cour de cassation',
      linkedEntitiesCount,
      publicationCategory: documentPublicationCategory,
      session: 'FRH',
      route: documentRoute,
      importer: documentImporter,
      source: documentSource,
      subAnnotationsNonSensitiveCount: 1,
      subAnnotationsSensitiveCount: 2,
      surAnnotationsCount: 3,
      treatmentDate: TREATMENT_DATE.getTime(),
      treatmentsSummary: [{ userId, treatmentDuration: 10 }],
      wordsCount: 5,
      annotationReportsChecklist: checklistMock,
    });
  });
});
