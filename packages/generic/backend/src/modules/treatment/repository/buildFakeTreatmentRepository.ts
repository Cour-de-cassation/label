import { idModule, indexer, treatmentType } from '@label/core';
import {
  buildFakeRepositoryBuilder,
  updateFakeCollection,
} from '../../../repository';
import { customTreatmentRepositoryType } from './customTreatmentRepositoryType';

export { buildFakeTreatmentRepository };

const buildFakeTreatmentRepository = buildFakeRepositoryBuilder<
  treatmentType,
  customTreatmentRepositoryType
>({
  collectionName: 'treatments',
  buildCustomFakeRepository: (collection) => ({
    async countByDocumentId(documentId) {
      return collection.filter((treatment) =>
        idModule.lib.equalId(documentId, treatment.documentId),
      ).length;
    },
    async deleteByDocumentId(documentId) {
      updateFakeCollection(
        collection,
        collection.filter(
          (treatment) =>
            !idModule.lib.equalId(treatment.documentId, documentId),
        ),
      );
    },

    async findAllByDocumentId(documentId) {
      return collection.filter((treatment) =>
        idModule.lib.equalId(treatment.documentId, documentId),
      );
    },

    async findAllByDocumentIds(documentIds) {
      const treatments = collection
        .filter((treatment) =>
          documentIds.some((documentId) =>
            idModule.lib.equalId(documentId, treatment.documentId),
          ),
        )
        .sort((treatmentA, treatmentB) => treatmentA.order - treatmentB.order);
      return indexer.indexManyBy(treatments, (treatment) =>
        idModule.lib.convertToString(treatment.documentId),
      );
    },

    async findExtremumLastUpdateDateBySources(sources) {
      if (collection.length === 0) {
        return { minDate: undefined, maxDate: undefined };
      }
      const sortedItems = collection
        .filter(({ source }) => sources.includes(source))
        .sort((item1, item2) => item1.lastUpdateDate - item2.lastUpdateDate);
      return {
        minDate: sortedItems[0].lastUpdateDate,
        maxDate: sortedItems[sortedItems.length - 1].lastUpdateDate,
      };
    },

    async findAllByLastUpdateDateLessThan(date) {
      return collection.filter(({ lastUpdateDate }) => date < lastUpdateDate);
    },
  }),
});
