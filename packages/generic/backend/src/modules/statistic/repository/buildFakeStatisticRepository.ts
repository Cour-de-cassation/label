import { idModule, statisticType } from '@label/core';
import {
  buildFakeRepositoryBuilder,
  updateFakeCollection,
} from '../../../repository';
import { buildFakeRessourceFilterRequest } from '../../ressourceFilter';
import { customStatisticRepositoryType } from './customStatisticRepositoryType';

export { buildFakeStatisticRepository };

const buildFakeStatisticRepository = buildFakeRepositoryBuilder<
  statisticType,
  customStatisticRepositoryType
>({
  collectionName: 'statistics',
  buildCustomFakeRepository: (collection) => ({
    async findAllByRessourceFilter(ressourceFilter) {
      return collection.filter(
        buildFakeRessourceFilterRequest(ressourceFilter),
      );
    },

    async findAllIdsBefore(date) {
      const statistics = collection.filter(
        (statistic) => statistic.treatmentDate <= date,
      );

      return statistics.map((statistic) => statistic._id);
    },

    async findExtremumTreatmentDateBySources(sources) {
      if (collection.length === 0) {
        return { minDate: undefined, maxDate: undefined };
      }
      const sortedItems = collection
        .filter(({ source }) => sources.includes(source))
        .sort((item1, item2) => item1.treatmentDate - item2.treatmentDate);
      return {
        minDate: sortedItems[0]?.treatmentDate,
        maxDate: sortedItems[sortedItems.length - 1]?.treatmentDate,
      };
    },

    async deleteTreatmentsSummaryByIds(ids) {
      let modifiedCount = 0;
      updateFakeCollection(
        collection,
        collection.map((treatment) => {
          if (ids.includes(treatment._id)) {
            modifiedCount++;
            return { ...treatment, treatmentsSummary: null };
          } else {
            return treatment;
          }
        }),
      );
      return modifiedCount;
    },
  }),
});
