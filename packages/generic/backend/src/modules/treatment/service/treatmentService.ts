import { uniqWith } from 'lodash';
import {
  annotationType,
  annotationsDiffModule,
  annotationsDiffType,
  assignationType,
  documentType,
  errorHandlers,
  idModule,
  idType,
  treatmentModule,
  treatmentType,
} from '@label/core';
import {
  assignationService,
  buildAssignationRepository,
} from '../../../modules/assignation';
import { documentService } from '../../../modules/document';
import { userService } from '../../user';
import { buildTreatmentRepository } from '../repository';

export { treatmentService };

const treatmentService = {
  async fetchAssignatedTreatments() {
    const treatmentRepository = buildTreatmentRepository();
    const treatmentIds = await assignationService.fetchAssignatedTreatmentIds();
    const treatments = await treatmentRepository.findAllByIds(treatmentIds);
    return treatments;
  },

  async fetchAnnotationsOfDocument(documentId: idType) {
    const treatmentRepository = buildTreatmentRepository();
    const treatments = await treatmentRepository.findAllByDocumentId(
      documentId,
    );

    return treatmentModule.lib.computeAnnotations(treatments);
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

  async fetchAssignatedTreatmentsWithDetails() {
    const assignationsById = await assignationService.fetchAllAssignationsById();

    const userNamesByAssignationId = await userService.fetchUserNamesByAssignationId(
      assignationsById,
    );
    const treatmentsByAssignationId = await treatmentService.fetchTreatmentsByAssignationId(
      assignationsById,
    );
    const documentIds = Object.values(treatmentsByAssignationId).map(
      (treatment) => treatment.documentId,
    );
    const documentsById = await documentService.fetchAllDocumentsByIds(
      documentIds,
    );

    const assignationIdsOfTreatedDocuments = Object.entries(
      treatmentsByAssignationId,
    )
      /* eslint-disable @typescript-eslint/no-unused-vars */
      .filter(([_assignationId, treatment]) => {
        const { documentId } = treatment;
        const document =
          documentsById[idModule.lib.convertToString(documentId)];
        const isDocumentTreated =
          document.status === 'done' || document.status === 'rejected';
        return isDocumentTreated;
      })
      .map(([assignationId]) => assignationId);

    return assignationIdsOfTreatedDocuments.map((assignationId) => ({
      treatment: treatmentsByAssignationId[assignationId],
      userName: userNamesByAssignationId[assignationId],
    }));
  },

  async fetchTreatmentsByAssignationId(
    assignationsById: Record<string, assignationType>,
  ) {
    const treatmentRepository = buildTreatmentRepository();

    const treatmentIds = Object.values(assignationsById).map(
      (assignation) => assignation.treatmentId,
    );
    const treatmentsById = await treatmentRepository.findAllByIds(treatmentIds);
    const treatmentsByAssignationId = Object.entries(assignationsById).reduce(
      (accumulator, [assignationId, assignation]) => {
        const treatment =
          treatmentsById[idModule.lib.convertToString(assignation.treatmentId)];

        return {
          ...accumulator,
          [assignationId]: treatment,
        };
      },
      {} as Record<string, treatmentType>,
    );
    return treatmentsByAssignationId;
  },
};
