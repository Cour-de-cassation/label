import { treatmentType } from '@label/core';
import { buildTreatmentRepository } from '../repository';

export { updateTreatmentDuration };

const TIME_THRESHOLD = 15 * 60 * 1000;

async function updateTreatmentDuration(treatmentId: treatmentType['_id']) {
  const treatmentRepository = buildTreatmentRepository();

  const treatment = await treatmentRepository.findById(treatmentId);

  const now = new Date();

  const elapsedTimeSinceLastUpdate = now.getTime() - treatment.lastUpdateDate;

  const duration =
    elapsedTimeSinceLastUpdate < TIME_THRESHOLD
      ? elapsedTimeSinceLastUpdate + treatment.duration
      : treatment.duration;

  await treatmentRepository.updateOne(treatmentId, {
    duration,
    lastUpdateDate: now.getTime(),
  });
}
