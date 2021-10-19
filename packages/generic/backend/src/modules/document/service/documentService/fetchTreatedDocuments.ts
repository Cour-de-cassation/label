import { sumBy } from 'lodash';
import {
  assignationType,
  errorHandlers,
  idModule,
  settingsType,
  treatmentModule,
} from '@label/core';
import { assignationService } from '../../../assignation';
import { treatmentService } from '../../../treatment';
import { userService } from '../../../user';
import { buildDocumentRepository } from '../../repository';

export { fetchTreatedDocuments };

async function fetchTreatedDocuments(settings: settingsType) {
  const documentRepository = buildDocumentRepository();

  const treatedDocuments = await documentRepository.findAllByStatusProjection(
    ['done', 'toBePublished'],
    [
      '_id',
      'decisionMetadata',
      'documentNumber',
      'publicationCategory',
      'reviewStatus',
      'source',
      'route',
    ],
  );

  const documentIds = treatedDocuments.map(({ _id }) => _id);
  const assignationsByDocumentId: Record<
    string,
    assignationType[] | undefined
  > = await assignationService.fetchAssignationsByDocumentIds(documentIds, {
    assertEveryDocumentIsAssigned: false,
  });

  const usersByIds = await userService.fetchUsers();
  const treatmentsByDocumentId = await treatmentService.fetchTreatmentsByDocumentIds(
    documentIds,
  );

  return treatedDocuments.map((treatedDocument) => {
    const documentIdString = idModule.lib.convertToString(treatedDocument._id);
    const assignations = assignationsByDocumentId[documentIdString];
    let totalTreatmentDuration: number | undefined,
      lastTreatmentDate: number | undefined,
      subAnnotationsNonSensitiveCount: number | undefined,
      surAnnotationsCount: number | undefined,
      subAnnotationsSensitiveCount: number | undefined = undefined;
    let userNames: string[] = [];
    if (assignations !== undefined) {
      const treatments = treatmentsByDocumentId[documentIdString];
      const humanTreatments = treatmentModule.lib.extractHumanTreatments(
        treatments,
        assignations,
      );
      if (humanTreatments.length === 0) {
        throw errorHandlers.serverErrorHandler.build(
          `No human treatment found for document ${documentIdString}`,
        );
      }
      userNames = humanTreatments.map(
        ({ userId }) => usersByIds[idModule.lib.convertToString(userId)].name,
      );
      totalTreatmentDuration = sumBy(
        humanTreatments,
        ({ treatment }) => treatment.duration,
      );
      lastTreatmentDate =
        humanTreatments[humanTreatments.length - 1].treatment.lastUpdateDate;

      if (humanTreatments.length === 1) {
        const humanTreatment = humanTreatments[0];
        subAnnotationsNonSensitiveCount =
          humanTreatment.treatment.subAnnotationsNonSensitiveCount;
        subAnnotationsSensitiveCount =
          humanTreatment.treatment.subAnnotationsSensitiveCount;
        surAnnotationsCount = humanTreatment.treatment.surAnnotationsCount;
      } else {
        const treatmentInfo = treatmentModule.lib.aggregateTreatmentInfo(
          humanTreatments.map(({ treatment }) => treatment),
          settings,
        );
        subAnnotationsNonSensitiveCount =
          treatmentInfo.subAnnotationsNonSensitiveCount;
        subAnnotationsSensitiveCount =
          treatmentInfo.subAnnotationsSensitiveCount;
        surAnnotationsCount = treatmentInfo.surAnnotationsCount;
      }
    }

    return {
      document: {
        _id: treatedDocument._id,
        documentNumber: treatedDocument.documentNumber,
        jurisdiction: treatedDocument.decisionMetadata.jurisdiction,
        occultationBlock: treatedDocument.decisionMetadata.occultationBlock,
        publicationCategory: treatedDocument.publicationCategory,
        reviewStatus: treatedDocument.reviewStatus,
        route: treatedDocument.route,
        source: treatedDocument.source,
      },
      totalTreatmentDuration,
      lastTreatmentDate,
      statistic: {
        subAnnotationsNonSensitiveCount,
        surAnnotationsCount,
        subAnnotationsSensitiveCount,
      },
      userNames,
    };
  });
}
