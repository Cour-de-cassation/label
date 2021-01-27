import { uniqWith } from 'lodash';
import {
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

  async fetchAssignatedTreatmentsWithDetails() {
    const assignationsById = await assignationService.fetchAllAssignationsById();

    const userNamesByAssignationId = await userService.fetchUserNamesByAssignationId(
      assignationsById,
    );
    const treatmentsByAssignationId = await treatmentService.fetchTreatmentsByAssignationId(
      assignationsById,
    );
    return Object.keys(assignationsById).map((assignationId) => ({
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
