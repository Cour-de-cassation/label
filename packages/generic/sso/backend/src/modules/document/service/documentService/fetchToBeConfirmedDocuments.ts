import { sumBy } from 'lodash';
import { assignationType, idModule, treatmentModule } from '@label/core';
import { assignationService } from '../../../assignation';
import { treatmentService } from '../../../treatment';
import { userService } from '../../../user';
import { buildDocumentRepository } from '../../repository';

export { fetchToBeConfirmedDocuments };

async function fetchToBeConfirmedDocuments() {
  const documentRepository = buildDocumentRepository();

  const toBeConfirmedDocuments = await documentRepository.findAllByStatusProjection(
    ['toBeConfirmed'],
    [
      '_id',
      'decisionMetadata',
      'documentNumber',
      'publicationCategory',
      'reviewStatus',
      'route',
    ],
  );

  const documentIds = toBeConfirmedDocuments.map(({ _id }) => _id);
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

  return toBeConfirmedDocuments.map((toBeConfirmedDocument) => {
    const documentIdString = idModule.lib.convertToString(
      toBeConfirmedDocument._id,
    );
    const assignations = assignationsByDocumentId[documentIdString];
    let totalTreatmentDuration: number | undefined,
      lastTreatmentDate: number | undefined;
    let userNames: string[] = [];
    if (assignations !== undefined) {
      const treatments = treatmentsByDocumentId[documentIdString];
      const humanTreatments = treatmentModule.lib.extractHumanTreatments(
        treatments,
        assignations,
      );

      userNames = humanTreatments.map(
        ({ userId }) => usersByIds[idModule.lib.convertToString(userId)].name,
      );
      totalTreatmentDuration = sumBy(
        humanTreatments,
        ({ treatment }) => treatment.duration,
      );

      lastTreatmentDate =
        humanTreatments[humanTreatments.length - 1].treatment.lastUpdateDate;
    }

    return {
      document: {
        _id: toBeConfirmedDocument._id,
        documentNumber: toBeConfirmedDocument.documentNumber,
        jurisdiction: toBeConfirmedDocument.decisionMetadata.jurisdiction,
        occultationBlock:
          toBeConfirmedDocument.decisionMetadata.occultationBlock,
        publicationCategory: toBeConfirmedDocument.publicationCategory,
        route: toBeConfirmedDocument.route,
        reviewStatus: toBeConfirmedDocument.reviewStatus,
      },
      totalTreatmentDuration,
      lastTreatmentDate,
      userNames,
    };
  });
}
