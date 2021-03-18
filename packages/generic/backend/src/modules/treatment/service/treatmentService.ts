import { uniqWith } from 'lodash';
import {
  annotationType,
  annotationsDiffModule,
  annotationsDiffType,
  documentType,
  idModule,
  idType,
  treatmentModule,
  treatmentType,
} from '@label/core';
import { assignationService } from '../../../modules/assignation';
import { buildTreatmentRepository } from '../repository';

export { treatmentService };

const treatmentService = {
  async fetchAnnotationsOfDocument(documentId: idType) {
    const treatmentRepository = buildTreatmentRepository();
    const treatments = await treatmentRepository.findAllByDocumentId(
      documentId,
    );

    return treatmentModule.lib.computeAnnotations(treatments);
  },

  async fetchTreatmentsByDocumentIds(documentIds: idType[]) {
    const treatmentRepository = buildTreatmentRepository();
    const treatmentsByDocumentIds = await treatmentRepository.findAllByDocumentIds(
      documentIds,
    );

    return treatmentsByDocumentIds;
  },

  async fetchTreatmentsByDocumentId(documentId: idType) {
    const treatmentRepository = buildTreatmentRepository();
    const treatments = await treatmentRepository.findAllByDocumentId(
      documentId,
    );

    return treatments;
  },

  async fetchTreatedDocumentIds() {
    const treatmentRepository = buildTreatmentRepository();
    const treatments = await treatmentRepository.findAll();
    const treatedDocumentIds = uniqWith(
      treatments.map((treatment) => treatment.documentId),
      idModule.lib.equalId,
    );

    return treatedDocumentIds;
  },

  async createTreatment({
    documentId,
    previousAnnotations,
    nextAnnotations,
  }: {
    documentId: documentType['_id'];
    previousAnnotations: annotationType[];
    nextAnnotations: annotationType[];
  }): Promise<treatmentType['_id']> {
    const treatmentRepository = buildTreatmentRepository();
    const lastTreatment = await treatmentRepository.findLastOneByDocumentId(
      documentId,
    );
    const order = lastTreatment ? lastTreatment.order + 1 : 0;
    const treatment = treatmentModule.lib.buildTreatment({
      annotationsDiff: annotationsDiffModule.lib.computeAnnotationsDiff(
        previousAnnotations,
        nextAnnotations,
      ),
      documentId,
      duration: 0,
      order,
      lastUpdateDate: new Date().getTime(),
    });

    await treatmentRepository.insert(treatment);
    return treatment._id;
  },

  async updateTreatment({
    annotationsDiff,
    documentId,
    userId,
  }: {
    annotationsDiff: annotationsDiffType;
    documentId: idType;
    userId: idType;
  }) {
    const treatmentRepository = buildTreatmentRepository();
    const assignation = await assignationService.findOrCreateByDocumentIdAndUserId(
      { documentId, userId },
    );
    const treatment = await treatmentRepository.findById(
      assignation.treatmentId,
    );
    const squashedAnnotationsDiff = annotationsDiffModule.lib.squash([
      treatment.annotationsDiff,
      annotationsDiff,
    ]);
    const currentDate = new Date().getTime();
    const DURATION_THRESHOLD_BETWEEN_TIMESTAMPS = 10 * 60 * 1000;
    const updatedDuration =
      currentDate - treatment.lastUpdateDate <
      DURATION_THRESHOLD_BETWEEN_TIMESTAMPS
        ? currentDate - treatment.lastUpdateDate + treatment.duration
        : treatment.duration;

    await treatmentRepository.updateOne(assignation.treatmentId, {
      annotationsDiff: squashedAnnotationsDiff,
      duration: updatedDuration,
      lastUpdateDate: currentDate,
    });
  },
};
