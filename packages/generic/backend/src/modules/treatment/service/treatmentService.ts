import { annotationsDiffType, idType, treatmentModule } from '@label/core';
import { buildTreatmentRepository } from '../repository';

export { treatmentService };

const treatmentService = {
  async fetchTreatments() {
    const treatmentRepository = buildTreatmentRepository();
    const treatments = await treatmentRepository.findAll();
    return treatments;
  },
  async fetchAnnotationsOfDocument(documentId: idType) {
    const treatmentRepository = buildTreatmentRepository();
    const treatments = await treatmentRepository.findAllByDocumentId(
      documentId,
    );

    return treatmentModule.lib.computeAnnotations(treatments);
  },
  async createTreatment({
    annotationsDiff,
    documentId,
    duration,
  }: {
    annotationsDiff: annotationsDiffType;
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
        documentId,
        duration,
        order,
        annotationsDiff,
      }),
    );
  },
};
