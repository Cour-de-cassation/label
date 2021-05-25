import { idModule, indexer, treatmentType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customTreatmentRepositoryType } from './customTreatmentRepositoryType';

export { buildTreatmentRepository };

const buildTreatmentRepository = buildRepositoryBuilder<
  treatmentType,
  customTreatmentRepositoryType
>({
  collectionName: 'treatments',
  indexes: [
    {
      index: {
        documentId: 1,
      },
    } as const,
    {
      index: {
        documentId: 1,
        order: 1,
      },
      mustBeUnique: true,
    } as const,
  ],
  buildCustomRepository: (collection) => ({
    async countByDocumentId(documentId) {
      return collection.countDocuments({ documentId });
    },
    async deleteByDocumentId(documentId) {
      await collection.deleteMany({ documentId });
    },

    async findAllByDocumentId(documentId) {
      return collection.find({ documentId }).toArray();
    },

    async findAllByDocumentIds(documentIds) {
      const treatments = await collection
        .find({ documentId: { $in: documentIds } })
        .toArray();

      const sortedTreatments = treatments.sort(
        (treatmentA, treatmentB) => treatmentA.order - treatmentB.order,
      );

      return indexer.indexManyBy(sortedTreatments, (treatment) =>
        idModule.lib.convertToString(treatment.documentId),
      );
    },
  }),
});
