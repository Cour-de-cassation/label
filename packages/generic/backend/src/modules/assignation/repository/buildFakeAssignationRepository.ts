import { assignationType, idModule } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customAssignationRepositoryType } from './customAssignationRepositoryType';

export { buildFakeAssignationRepository };

const buildFakeAssignationRepository = buildFakeRepositoryBuilder<
  assignationType,
  customAssignationRepositoryType
>({
  buildCustomFakeRepository: (collection) => ({
    async findAllByUserId(userId) {
      return collection.filter((assignation) =>
        idModule.lib.equalId(assignation.userId, userId),
      );
    },
    async findByDocumentIdAndUserId({ documentId, userId }) {
      const result = collection.find(
        (assignation) =>
          idModule.lib.equalId(assignation.documentId, documentId) &&
          idModule.lib.equalId(assignation.userId, userId),
      );
      return result;
    },
  }),
});
