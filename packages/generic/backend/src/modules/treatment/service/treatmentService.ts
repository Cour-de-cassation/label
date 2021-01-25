import {
  annotationsDiffType,
  documentType,
  errorHandlers,
  idType,
  treatmentModule,
  treatmentType,
} from '@label/core';
import { buildAssignationRepository } from '../../../modules/assignation';
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

  async createEmptyTreatment(
    documentId: documentType['_id'],
  ): Promise<treatmentType['_id']> {
    const treatmentRepository = buildTreatmentRepository();
    const lastTreatment = await treatmentRepository.findLastOneByDocumentId(
      documentId,
    );
    const order = lastTreatment ? lastTreatment.order + 1 : 0;
    const treatment = treatmentModule.lib.buildTreatment({
      annotationsDiff: { before: [], after: [] },
      documentId,
      duration: 0,
      order,
    });

    await treatmentRepository.insert(treatment);
    return treatment._id;
  },

  async updateTreatment({
    annotationsDiff,
    documentId,
    duration,
    userId,
  }: {
    annotationsDiff: annotationsDiffType;
    documentId: idType;
    duration: number;
    userId: idType;
  }) {
    const treatmentRepository = buildTreatmentRepository();
    const assignationRepository = buildAssignationRepository();

    const assignation = await assignationRepository.findByDocumentIdAndUserId({
      documentId,
      userId,
    });
    if (!assignation) {
      throw errorHandlers.notFoundErrorHandler.build(
        `No assignation found for documentId ${documentId} and userId ${userId}`,
      );
    }

    await treatmentRepository.updateOne(assignation.treatmentId, {
      annotationsDiff,
      duration,
    });
  },
};
