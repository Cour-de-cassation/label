import { treatmentType } from '@label/core';
import { buildTreatmentRepository } from '../repository';

export { resetTreatmentLastUpdateDate };

async function resetTreatmentLastUpdateDate(
  treatmentId: treatmentType['_id'],
  mustIncrementIdleDuration: boolean,
) {
  const treatmentRepository = buildTreatmentRepository();

  const treatment = await treatmentRepository.findById(treatmentId);

  const now = new Date();

  if (mustIncrementIdleDuration) {
    const idleDuration =
      now.getTime() - treatment.lastUpdateDate + treatment.idleDuration;

    await treatmentRepository.updateOne(treatmentId, {
      idleDuration,
      lastUpdateDate: now.getTime(),
    });
  } else {
    await treatmentRepository.updateOne(treatmentId, {
      lastUpdateDate: now.getTime(),
    });
  }
}
