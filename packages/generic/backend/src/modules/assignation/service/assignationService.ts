import { assignationStatusType, assignationModule, idType } from '@label/core';
import { groupBy } from 'lodash';
import { buildAssignationRepository } from '../repository';

export { assignationService };

const assignationService = {
  async fetchDocumentIdsAssignatedByUserId(): Promise<{
    [userId: string]: idType[];
  }> {
    const assignationRepository = buildAssignationRepository();
    const assignations = await assignationRepository.findAll();
    const assignationsGroupedByUser = groupBy(
      assignations,
      (assignation) => assignation.userId,
    );

    const documentIdsAssignatedByUser: { [userId: string]: idType[] } = {};
    Object.entries(assignationsGroupedByUser).forEach(
      ([userId, assignations]) =>
        (documentIdsAssignatedByUser[userId] = assignations.map(
          (assignation) => assignation.documentId,
        )),
    );

    return documentIdsAssignatedByUser;
  },

  async createAssignation({
    userId,
    documentId,
  }: {
    userId: idType;
    documentId: idType;
  }) {
    const assignationRepository = buildAssignationRepository();
    const assignation = assignationModule.lib.buildAssignation({
      userId,
      documentId,
      status: 'pending',
    });
    return assignationRepository.insert(assignation);
  },

  async updateStatus(userId: idType, documentId: idType, status: string) {
    const assignationRepository = buildAssignationRepository();
    await assignationRepository.updateStatus(
      userId,
      documentId,
      parseStatus(status),
    );
  },
};

function parseStatus(statusString: string): assignationStatusType {
  switch (statusString) {
    case 'pending':
      return 'pending';
    case 'saved':
      return 'saved';
    case 'done':
      return 'done';
    case 'rejected':
      return 'rejected';
    default:
      throw new Error(`Assignation status ${statusString} is not handled`);
  }
}
