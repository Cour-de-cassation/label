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

  const DURATION_THRESHOLD_BETWEEN_TIMESTAMPS = 10 * 60 * 1000;
  const currentDate = new Date().getTime();

  const assignation = await assignationService.findOrCreateByDocumentIdAndUserId(
    { documentId, userId },
  );
  const previousTreatments = await treatmentRepository.findAllByDocumentId(
    documentId,
  );
  const sortedTreatments = treatmentModule.lib.sortInConsistentOrder(
    previousTreatments,
  );

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

  if (
    !treatmentModule.lib.areAnnotationsConsistent(
      sortedTreatments.filter(
        ({ _id }) => !idModule.lib.equalId(_id, treatment._id),
      ),
      updatedTreatment,
    )
  ) {
    throw new Error(
      `Could not create treatment for documentId ${idModule.lib.convertToString(
        documentId,
      )}: inconsistent annotations`,
    );
  }

  await treatmentRepository.updateOne(
    assignation.treatmentId,
    updatedTreatment,
  );
}
