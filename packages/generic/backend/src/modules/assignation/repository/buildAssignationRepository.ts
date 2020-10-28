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
    async findByUserId(userId) {
      return collection.find({ userId }).toArray();
    },
    async updateStatus(userId, documentId, status) {
      await collection.update({ userId, documentId }, { $set: { status } });
    },
  }),
});
