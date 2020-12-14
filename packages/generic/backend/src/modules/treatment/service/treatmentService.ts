import { idType, treatmentModule } from '@label/core';
import { buildTreatmentRepository } from '../repository';

export { treatmentService };

const treatmentService = {
  async fetchTreatments() {
    const treatmentRepository = buildTreatmentRepository();
    const treatments = await treatmentRepository.findAll();
    return treatments;
  },
  async createTreatment({
    userId,
    documentId,
    duration,
  }: {
    userId: idType;
    documentId: idType;
    duration: number;
  }) {
    const treatmentRepository = buildTreatmentRepository();

    await treatmentRepository.insert(
      treatmentModule.lib.buildTreatment({
        userId,
        documentId,
        duration,
        order: 0,
      }),
    );
  },
};
