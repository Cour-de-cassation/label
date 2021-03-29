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
  ],
  buildCustomRepository: (collection) => ({
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
        (treatmentA, treatmentB) => treatmentB.order - treatmentA.order,
      );

      return indexer.indexManyBy(sortedTreatments, (treatment) =>
        idModule.lib.convertToString(treatment.documentId),
      );
    },

    async updateOne(
      treatmentId,
      { annotationsDiff, duration, lastUpdateDate },
    ) {
      await collection.updateOne(
        { _id: treatmentId },
        { $set: { annotationsDiff, duration, lastUpdateDate } },
      );
    },
  }),
});
