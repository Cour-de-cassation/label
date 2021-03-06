import { idModule, treatmentType } from '@label/core';
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
    async findAllByDocumentId(documentId) {
      return collection.filter((treatment) =>
        idModule.lib.equalId(treatment.documentId, documentId),
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
    async updateOne(treatmentId, { annotationsDiff, duration }) {
      updateFakeCollection(
        collection,
        collection.map((treatment) =>
          idModule.lib.equalId(treatmentId, treatment._id)
            ? {
                ...treatment,
                duration,
                annotationsDiff,
              }
            : treatment,
        ),
      );
    },
  }),
});
