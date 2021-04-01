import {
  assignationModule,
  assignationType,
  documentType,
  errorHandlers,
  idModule,
  idType,
  userType,
} from '@label/core';
import { buildTreatmentRepository } from '../../treatment/repository';
import { documentService } from '../../document';
import { treatmentService } from '../../treatment';
import { buildAssignationRepository } from '../repository';

export { assignationService };

const assignationService = {
  async assertDocumentIsAssignatedToUser({
    documentId,
    userId,
  }: {
    documentId: documentType['_id'];
    userId: userType['_id'];
  }) {
    const assignationRepository = buildAssignationRepository();
    const assignation = await assignationRepository.findByDocumentIdAndUserId({
      documentId,
      userId,
    });

    if (!assignation) {
      throw errorHandlers.notFoundErrorHandler.build(
        `No assignation found for userId ${userId} and documentId ${documentId}`,
      );
    }
  },

  async fetchAssignatedTreatmentIds() {
    const assignationRepository = buildAssignationRepository();
    const assignations = await assignationRepository.findAll();

    return assignations.map((assignation) => assignation.treatmentId);
  },

  async fetchAssignations() {
    const assignationRepository = buildAssignationRepository();
    const assignations = await assignationRepository.findAll();

    return assignations;
  },

  async fetchAssignationId({
    userId,
    documentId,
  }: {
    userId: idType;
    documentId: idType;
  }) {
    const assignationRepository = buildAssignationRepository();
    const assignations = await assignationRepository.findAllByUserId(userId);
    const assignation = assignations.find((assignation) =>
      idModule.lib.equalId(assignation.documentId, documentId),
    );

    return assignation?._id;
  },

  async fetchAllAssignationsById(assignationIds?: assignationType['_id'][]) {
    const assignationRepository = buildAssignationRepository();

    return assignationRepository.findAllByIds(assignationIds);
  },

  async fetchAssignationsByDocumentIds(documentIdsToSearchIn: idType[]) {
    const assignationRepository = buildAssignationRepository();

    return assignationRepository.findAllByDocumentIds(documentIdsToSearchIn);
  },

  async fetchAssignationsOfDocumentId(
    documentId: idType,
  ): Promise<assignationType[]> {
    const assignationRepository = buildAssignationRepository();

    return assignationRepository.findAllByDocumentId(documentId);
  },

  async fetchDocumentIdsAssignatedToUserId(userId: idType) {
    const assignationRepository = buildAssignationRepository();
    const assignations = await assignationRepository.findAllByUserId(userId);

    return assignations.map((assignation) => assignation.documentId);
  },

  async findOrCreateByDocumentIdAndUserId({
    documentId,
    userId,
  }: {
    documentId: documentType['_id'];
    userId: userType['_id'];
  }) {
    const assignationRepository = buildAssignationRepository();
    const assignation = await assignationRepository.findByDocumentIdAndUserId({
      documentId,
      userId,
    });

    if (assignation) {
      return assignation;
    }

    return this.createAssignation({ documentId, userId });
  },

  async updateAssignationDocumentStatus(
    assignationId: assignationType['_id'],
    status: documentType['status'],
  ) {
    const assignationRepository = buildAssignationRepository();
    const assignation = await assignationRepository.findById(assignationId);

    await documentService.updateDocumentStatus(assignation.documentId, status);
  },

  async createAssignation({
    userId,
    documentId,
  }: {
    userId: idType;
    documentId: idType;
  }) {
    const assignationRepository = buildAssignationRepository();
    const treatmentId = await treatmentService.createTreatment({
      documentId,
      previousAnnotations: [],
      nextAnnotations: [],
      source: 'annotator',
    });
    const assignation = assignationModule.lib.buildAssignation({
      userId,
      documentId,
      treatmentId,
    });

    await assignationRepository.insert(assignation);

    return assignation;
  },

  async deleteAssignationsByDocumentId(documentId: documentType['_id']) {
    const assignationRepository = buildAssignationRepository();
    const treatmentRepository = buildTreatmentRepository();
    const assignationsToDelete = await assignationRepository.findAllByDocumentId(
      documentId,
    );

    await assignationRepository.deleteManyByIds(
      assignationsToDelete.map(({ _id }) => _id),
    );
    await treatmentRepository.deleteManyByIds(
      assignationsToDelete.map(({ treatmentId }) => treatmentId),
    );
  },
};
