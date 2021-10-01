import {
  annotationsDiffModule,
  annotationsDiffType,
  assignationType,
  idModule,
  settingsModule,
  settingsType,
  treatmentModule,
} from '@label/core';
import { documentService } from '../../document';
import { userService } from '../../user';
import { buildTreatmentRepository } from '../repository';

export { updateTreatment };

async function updateTreatment({
  annotationsDiff,
  assignation,
  settings,
}: {
  annotationsDiff: annotationsDiffType;
  assignation: assignationType;
  settings: settingsType;
}) {
  const treatmentRepository = buildTreatmentRepository();

  const userRole = await userService.fetchUserRole(assignation.userId);
  if (userRole === 'admin') {
    await documentService.updateDocumentReviewStatus(assignation.documentId, {
      hasBeenAmended: true,
    });
  }
  const treatments = await treatmentRepository.findAllByDocumentId(
    assignation.documentId,
  );
  const sortedTreatments = treatmentModule.lib.sortInConsistentOrder(
    treatments,
  );

  const document = await documentService.fetchDocument(assignation.documentId);
  const settingsForDocument = settingsModule.lib.computeFilteredSettings(
    settings,
    document.decisionMetadata.categoriesToOmit,
    document.decisionMetadata.additionalTermsToAnnotate,
  );

  const actionToPerform = `update treatment for documentId ${idModule.lib.convertToString(
    assignation.documentId,
  )}`;
  const previousAnnotations = treatmentModule.lib.computeAnnotations(
    sortedTreatments,
  );
  const treatment = await treatmentRepository.findById(assignation.treatmentId);
  annotationsDiffModule.lib.assertAnnotationsDiffAreConsistent(
    annotationsDiff,
    {
      settings: settingsForDocument,
      previousAnnotations,
      treatmentSource: treatment.source,
    },
    actionToPerform,
  );

  const duration = treatmentModule.lib.incrementTreatmentDuration({
    lastUpdateDate: treatment.lastUpdateDate,
    previousTreatmentDuration: treatment.duration,
  });

  const updatedTreatment = treatmentModule.lib.update(
    treatment,
    {
      annotationsDiff: annotationsDiffModule.lib.squash([
        treatment.annotationsDiff,
        annotationsDiff,
      ]),
      duration,
    },
    settingsForDocument,
  );

  await treatmentRepository.updateOne(
    assignation.treatmentId,
    updatedTreatment,
  );
}
