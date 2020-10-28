import { assignationType, idModule } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customAssignationRepositoryType } from './customAssignationRepositoryType';

export { buildFakeAssignationRepository };

const buildFakeAssignationRepository = buildFakeRepositoryBuilder<
  assignationType,
  customAssignationRepositoryType
>({
  buildCustomFakeRepository: (collection) => ({
    async findByUserId(userId) {
      return collection.filter((assignation) =>
        idModule.lib.equalId(assignation.userId, userId),
      );
    },
    async updateStatus(userId, documentId, status) {
      const assignation = collection.find(
        (assignation) =>
          idModule.lib.equalId(assignation.documentId, documentId) &&
          idModule.lib.equalId(assignation.userId, userId),
      );

      if (assignation) {
        assignation.status = status;
      }
    },
  }),
});
