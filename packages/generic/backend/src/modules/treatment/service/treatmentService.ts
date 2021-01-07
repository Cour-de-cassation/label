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

    const lastTreatment = await treatmentRepository.findLastOneByDocumentId(
      documentId,
    );
    const order = lastTreatment ? lastTreatment.order + 1 : 0;

    await treatmentRepository.insert(
      treatmentModule.lib.buildTreatment({
        userId,
        documentId,
        duration,
        order,
        before: [],
        after: [], // TODO insert annotation in it
      }),
    );
  },
};
