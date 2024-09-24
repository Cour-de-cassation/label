import { dependencyManager } from '../../../utils';
import { buildFakeStatisticRepository } from './buildFakeStatisticRepository';
import { buildStatisticRepository } from './buildStatisticRepository';

export { buildRepository as buildStatisticRepository };

const buildRepository = dependencyManager.inject({
  forLocal: buildStatisticRepository,
  forProd: buildStatisticRepository,
  forTest: buildFakeStatisticRepository,
});
