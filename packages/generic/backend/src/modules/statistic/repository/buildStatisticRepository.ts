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
  }),
});
