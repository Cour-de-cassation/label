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

    async findExtremumLastUpdateDateBySources(sources) {
      const minDateStatistics = await collection
        .find({ source: { $in: sources } })
        .sort({ lastUpdateDate: 1 })
        .limit(1)
        .toArray();

      const maxDateStatistics = await collection
        .find({ source: { $in: sources } })
        .sort({ lastUpdateDate: -1 })
        .limit(1)
        .toArray();

      return {
        minDate: minDateStatistics[0]?.lastUpdateDate,
        maxDate: maxDateStatistics[0]?.lastUpdateDate,
      };
    },

    async findAllByLastUpdateDateLessThan(lastUpdateDate) {
      return collection
        .find({ lastUpdateDate: { $lt: lastUpdateDate } })
        .toArray();
    },
  }),
});
