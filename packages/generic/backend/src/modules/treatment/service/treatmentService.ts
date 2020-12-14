import { buildTreatmentRepository } from '../repository';

export { treatmentService };

const treatmentService = {
  async fetchTreatments() {
    const treatmentRepository = buildTreatmentRepository();
    const treatments = await treatmentRepository.findAll();
    return treatments;
  },
};
