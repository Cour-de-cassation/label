import { statisticGenerator } from './generator';
import { aggregate, buildStatistic, simplify } from './lib';
import { statisticModel, statisticType } from './statisticType';

export { statisticModule };

export type { statisticType };

const statisticModule = {
  model: statisticModel,
  generator: statisticGenerator,
  lib: { aggregate, buildStatistic, simplify },
};
