import { statisticType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { buildRessourceFilterRequest } from '../../ressourceFilter';
import { customStatisticRepositoryType } from './customStatisticRepositoryType';

export { buildStatisticRepository };

const buildStatisticRepository = buildRepositoryBuilder<
  statisticType,
  customStatisticRepositoryType
>({
  collectionName: 'statistics',
  indexes: [],
  buildCustomRepository: (collection) => ({
    async findAllByRessourceFilter(ressourceFilter) {
      const ressourceFilterRequest = buildRessourceFilterRequest(
        ressourceFilter,
      );

      return collection.find(ressourceFilterRequest).toArray();
    },

    async findAllIdsBefore(date) {
      const statistics = await collection
        .find({ treatmentDate: { $lte: date } })
        .project({ _id: 1 })
        .toArray();

      return statistics.map((statistic) => statistic._id);
    },
  }),
});
