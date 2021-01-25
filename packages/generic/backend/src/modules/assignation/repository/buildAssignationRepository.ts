import { assignationType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customAssignationRepositoryType } from './customAssignationRepositoryType';

export { buildAssignationRepository };

const buildAssignationRepository = buildRepositoryBuilder<
  assignationType,
  customAssignationRepositoryType
>({
  collectionName: 'assignations',
  buildCustomRepository: (collection) => ({
    async findAllByUserId(userId) {
      return collection.find({ userId }).toArray();
    },
    async findByDocumentIdAndUserId({ documentId, userId }) {
      const result = await collection.find({ documentId, userId }).toArray();
      if (result.length === 0) {
        return undefined;
      }
      return result[0];
    },
  }),
});
