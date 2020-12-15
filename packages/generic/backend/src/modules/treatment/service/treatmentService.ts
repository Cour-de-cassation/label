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
    annotationIds,
  }: {
    userId: idType;
    documentId: idType;
    duration: number;
    annotationIds: idType[];
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
        annotationIds,
      }),
    );
  },
};
