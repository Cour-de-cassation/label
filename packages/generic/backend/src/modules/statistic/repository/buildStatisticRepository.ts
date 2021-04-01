import { statisticType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customStatisticRepositoryType } from './customStatisticRepositoryType';

export { buildStatisticRepository };

const buildStatisticRepository = buildRepositoryBuilder<
  statisticType,
  customStatisticRepositoryType
>({
  collectionName: 'statistics',
  indexes: [],
  buildCustomRepository: () => ({}),
});
