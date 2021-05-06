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
      documentId: 1,
    } as const,
    {
      documentId: 1,
      order: 1,
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

    async findLastOneByDocumentId(documentId) {
      const result = await collection.find({ documentId }).toArray();

      return result.sort(
        (treatmentA, treatmentB) => treatmentB.order - treatmentA.order,
      )[0];
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
