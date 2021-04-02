import { statisticGenerator } from './generator';
import { buildStatistic } from './lib';
import { statisticModel, statisticType } from './statisticType';

export { statisticModule };

export type { statisticType };

const statisticModule = {
  model: statisticModel,
  generator: statisticGenerator,
  lib: { buildStatistic },
};
