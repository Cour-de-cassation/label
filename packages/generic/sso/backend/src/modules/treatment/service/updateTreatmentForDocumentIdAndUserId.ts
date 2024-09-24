import { annotationsDiffType, idType, settingsType } from '@label/core';
import { assignationService } from '../../assignation';
import { updateTreatment } from './updateTreatment';

export { updateTreatmentForDocumentIdAndUserId };

async function updateTreatmentForDocumentIdAndUserId(
  {
    annotationsDiff,
    documentId,
    userId,
  }: {
    annotationsDiff: annotationsDiffType;
    documentId: idType;
    userId: idType;
  },
  settings: settingsType,
) {
  const assignation = await assignationService.findOrCreateByDocumentIdAndUserId(
    { documentId, userId },
  );

  return updateTreatment({ annotationsDiff, assignation, settings });
}
