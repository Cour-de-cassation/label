import { assignationType, idModule, indexer } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customAssignationRepositoryType } from './customAssignationRepositoryType';

export { buildAssignationRepository };

const buildAssignationRepository = buildRepositoryBuilder<
  assignationType,
  customAssignationRepositoryType
>({
  collectionName: 'assignations',
  indexes: [
    {
      documentId: 1,
    } as const,
    {
      documentId: 1,
      userId: 1,
    } as const,
  ],
  buildCustomRepository: (collection) => ({
    async findAllByUserId(userId) {
      return collection.find({ userId }).toArray();
    },

    async findAllByDocumentIds(documentIdsToSearchIn) {
      const assignations = await collection
        .find({ documentId: { $in: documentIdsToSearchIn } })
        .toArray();

      return indexer.indexManyBy(assignations, (assignation) =>
        idModule.lib.convertToString(assignation.documentId),
      );
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

    async findByTreatmentId(treatmentId) {
      const result = await collection.find({ treatmentId }).toArray();

      if (result.length === 0) {
        return undefined;
      }
      return result[0];
    },
  }),
});
