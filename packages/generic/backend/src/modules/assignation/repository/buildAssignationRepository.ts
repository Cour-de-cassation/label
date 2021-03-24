import { assignationType, idModule } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customAssignationRepositoryType } from './customAssignationRepositoryType';

export { buildAssignationRepository };

const buildAssignationRepository = buildRepositoryBuilder<
  assignationType,
  customAssignationRepositoryType
>({
  collectionName: 'assignations',
  indexes: [],
  buildCustomRepository: (collection) => ({
    async findAllByUserId(userId) {
      return collection.find({ userId }).toArray();
    },
    async findAllByDocumentIds(documentIdsToSearchIn) {
      const assignations = await collection
        .find({ documentId: { $in: documentIdsToSearchIn } })
        .toArray();
      return assignations.reduce((accumulator, assignation) => {
        return {
          ...accumulator,
          [idModule.lib.convertToString(assignation.documentId)]: assignation,
        };
      }, {} as Record<string, assignationType>);
    },
    async findByDocumentIdAndUserId({ documentId, userId }) {
      const result = await collection.find({ documentId, userId }).toArray();
      if (result.length === 0) {
        return undefined;
      }
      return result[0];
    },
    async findAllByDocumentId(documentId) {
      const result = await collection.find({ documentId }).toArray();
      return result;
    },
  }),
});
