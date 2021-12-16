import { buildTreatmentRepository } from '../../../../modules/treatment';
import { logger } from '../../../../utils';

export { up, down };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
async function up() {
  logger.log('Up: ');

  const treatmentRepository = buildTreatmentRepository();

  await treatmentRepository.deletePropertiesForMany({}, ['idleDuration']);
}

async function down() {
  logger.log('Down: ');

  const treatmentRepository = buildTreatmentRepository();

  const treatments = await treatmentRepository.findAll();

  await Promise.all(
    treatments.map((treatment) =>
      treatmentRepository.updateOne(treatment._id, {
        idleDuration: 0,
      } as any),
    ),
  );
}
