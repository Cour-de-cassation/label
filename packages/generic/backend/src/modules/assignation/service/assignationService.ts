import { assignationModule, mongoIdType } from '@label/core';
import { groupBy } from 'lodash';
import { buildAssignationRepository } from '../repository/buildAssignationRepository';

export { assignationService };

const assignationService = {
  async fetchDocumentIdsAssignatedByUser() {
    const assignationRepository = buildAssignationRepository();
    const assignations = await assignationRepository.findAll();
    const assignationsGroupedByUser = groupBy(
      assignations,
      (assignation) => assignation.userId,
    );
    const documentIdsAssignatedByUser = Object.keys(
      assignationsGroupedByUser,
    ).reduce((accumulator, userId) => {
      return {
        ...accumulator,
        [userId]: assignationsGroupedByUser[userId].map(
          (assignation) => assignation.documentId,
        ),
      };
    }, {} as Record<string, mongoIdType[]>);

    return documentIdsAssignatedByUser;
  },
  createAssignation({
    userId,
    documentId,
  }: {
    userId: mongoIdType;
    documentId: mongoIdType;
  }) {
    const assignationRepository = buildAssignationRepository();
    const assignation = assignationModule.lib.buildAssignation({
      userId,
      documentId,
    });
    return assignationRepository.insert(assignation);
  },
};
