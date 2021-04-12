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
  buildCustomFakeRepository: (collection) => ({
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

    async findLastOneByDocumentId(documentId) {
      const result = collection.filter((treatment) =>
        idModule.lib.equalId(treatment.documentId, documentId),
      );

      return result.sort(
        (treatmentA, treatmentB) => treatmentB.order - treatmentA.order,
      )[0];
    },
  }),
});
