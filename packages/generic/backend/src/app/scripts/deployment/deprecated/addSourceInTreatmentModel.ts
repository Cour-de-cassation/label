import { buildTreatmentRepository } from '../../../../modules/treatment';

export { addSourceInTreatmentModel };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
async function addSourceInTreatmentModel() {
  const treatmentRepository = buildTreatmentRepository();

  const treatments = await treatmentRepository.findAll();

  const treatmentsWithNewDataModel = treatments.map((treatment) => ({
    ...treatment,
    source: 'NLP' as const,
  }));

  await treatmentRepository.clear();

  await Promise.all(treatmentsWithNewDataModel.map(treatmentRepository.insert));
}
