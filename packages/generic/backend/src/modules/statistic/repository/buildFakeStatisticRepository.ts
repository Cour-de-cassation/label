import { statisticType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customStatisticRepositoryType } from './customStatisticRepositoryType';

export { buildFakeStatisticRepository };

const buildFakeStatisticRepository = buildFakeRepositoryBuilder<
  statisticType,
  customStatisticRepositoryType
>({
  buildCustomFakeRepository: () => ({}),
});
