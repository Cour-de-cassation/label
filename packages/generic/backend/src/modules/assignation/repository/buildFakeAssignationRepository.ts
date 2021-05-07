import { assignationType, idModule, indexer } from '@label/core';
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

    async findAllByDocumentIds(documentIdsToSearchIn) {
      const assignations = collection.filter((assignation) =>
        documentIdsToSearchIn.some((documentId) =>
          idModule.lib.equalId(documentId, assignation.documentId),
        ),
      );

      return indexer.indexManyBy(assignations, (assignation) =>
        idModule.lib.convertToString(assignation.documentId),
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

    async findAllByDocumentId(documentId) {
      return collection.filter((assignation) =>
        idModule.lib.equalId(assignation.documentId, documentId),
      );
    },
  }),
});
