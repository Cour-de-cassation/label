import { treatmentType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customTreatmentRepositoryType } from './customTreatmentRepositoryType';

export { buildTreatmentRepository };

const buildTreatmentRepository = buildRepositoryBuilder<
  treatmentType,
  customTreatmentRepositoryType
>({
  collectionName: 'treatments',
  buildCustomRepository: (collection) => ({
    async findAllByDocumentId(documentId) {
      return collection.find({ documentId }).toArray();
    },
    async findLastOneByDocumentId(documentId) {
      const result = await collection.find({ documentId }).toArray();

      return result.sort(
        (treatmentA, treatmentB) => treatmentB.order - treatmentA.order,
      )[0];
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
