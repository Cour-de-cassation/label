import {
  annotationsDiffModule,
  annotationsDiffType,
  idModule,
  idType,
  treatmentModule,
} from '@label/core';
import { assignationService } from '../../../modules/assignation';
import { buildTreatmentRepository } from '../repository';

export { updateTreatment };

async function updateTreatment({
  annotationsDiff,
  documentId,
  userId,
}: {
  annotationsDiff: annotationsDiffType;
  documentId: idType;
  userId: idType;
}) {
  const treatmentRepository = buildTreatmentRepository();

  const DURATION_THRESHOLD_BETWEEN_TIMESTAMPS = 15 * 60 * 1000;
  const currentDate = new Date().getTime();

  const assignation = await assignationService.findOrCreateByDocumentIdAndUserId(
    { documentId, userId },
  );
  const treatments = await treatmentRepository.findAllByDocumentId(documentId);
  const sortedTreatments = treatmentModule.lib.sortInConsistentOrder(
    treatments,
  );

  if (
    !annotationsDiffModule.lib.areAnnotationsDiffCompatibleWithAnnotations(
      treatmentModule.lib.computeAnnotations(sortedTreatments),
      annotationsDiff,
    )
  ) {
    throw new Error(
      `Could not update treatment for documentId ${idModule.lib.convertToString(
        documentId,
      )}: inconsistent annotations`,
    );
  }

  const treatment = await treatmentRepository.findById(assignation.treatmentId);

  const updatedTreatment = treatmentModule.lib.update(treatment, {
    annotationsDiff: annotationsDiffModule.lib.squash([
      treatment.annotationsDiff,
      annotationsDiff,
    ]),
    duration:
      currentDate - treatment.lastUpdateDate <
      DURATION_THRESHOLD_BETWEEN_TIMESTAMPS
        ? currentDate - treatment.lastUpdateDate + treatment.duration
        : treatment.duration,
  });

  await treatmentRepository.updateOne(
    assignation.treatmentId,
    updatedTreatment,
  );
}
