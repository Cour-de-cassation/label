import { treatmentType, treatmentModule } from '@label/core';
import { buildTreatmentRepository } from '../repository';

export { updateTreatmentDuration };

async function updateTreatmentDuration(treatmentId: treatmentType['_id']) {
  const treatmentRepository = buildTreatmentRepository();

  const treatment = await treatmentRepository.findById(treatmentId);

  const now = new Date();

  const elapsedTimeSinceLastUpdate = now.getTime() - treatment.lastUpdateDate;

  const duration =
    elapsedTimeSinceLastUpdate <
    treatmentModule.lib.getTimeThresholdToUpdateDuration()
      ? elapsedTimeSinceLastUpdate + treatment.duration
      : treatment.duration;

  await treatmentRepository.updateOne(treatmentId, {
    duration,
    lastUpdateDate: now.getTime(),
  });
}
