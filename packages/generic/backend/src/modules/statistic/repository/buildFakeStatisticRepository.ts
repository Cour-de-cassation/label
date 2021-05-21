import { statisticType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
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
  }),
});
