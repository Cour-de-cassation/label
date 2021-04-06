import { treatmentModule } from '@label/core';
import { logger } from '../../../utils';
import { buildTreatmentRepository } from '../../../modules/treatment';

export { addInfoInTreatment };

async function addInfoInTreatment() {
  const treatmentRepository = buildTreatmentRepository();

  const treatments = await treatmentRepository.findAll();

  for (const index in treatments) {
    logger.log(`Update ${parseInt(index) + 1}/${treatments.length}`);
    const treatment = treatments[index];

    await treatmentRepository.updateOne(
      treatment._id,
      treatmentModule.lib.update(treatment, treatment),
    );
  }
}
