import { treatmentModule, treatmentType } from '@label/core';
import { buildTreatmentRepository } from '../repository';

export { updateTreatmentDuration };

async function updateTreatmentDuration(treatmentId: treatmentType['_id']) {
  const treatmentRepository = buildTreatmentRepository();

  const treatment = await treatmentRepository.findById(treatmentId);

  const duration = treatmentModule.lib.incrementTreatmentDuration({
    previousTreatmentDuration: treatment.duration,
    lastUpdateDate: treatment.lastUpdateDate,
  });

  const lastUpdateDate = new Date();

  await treatmentRepository.updateOne(treatmentId, {
    duration,
    lastUpdateDate: lastUpdateDate.getTime(),
  });
}
