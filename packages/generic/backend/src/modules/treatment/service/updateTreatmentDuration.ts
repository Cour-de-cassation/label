import { treatmentType } from '@label/core';
import { buildTreatmentRepository } from '../repository';

export { updateTreatmentDuration };

async function updateTreatmentDuration(treatmentId: treatmentType['_id']) {
  const treatmentRepository = buildTreatmentRepository();

  const treatment = await treatmentRepository.findById(treatmentId);

  const now = new Date();

  const duration =
    now.getTime() - treatment.lastUpdateDate + treatment.duration;

  await treatmentRepository.updateOne(treatmentId, {
    duration,
    lastUpdateDate: now.getTime(),
  });
}
