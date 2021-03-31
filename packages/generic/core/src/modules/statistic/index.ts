import { statisticGenerator } from './generator';
import { buildStatistic } from './lib';
import { statisticDataModel, statisticType } from './statisticType';

export { statisticModule };

export type { statisticType };

const statisticModule = {
  dataModel: statisticDataModel,
  generator: statisticGenerator,
  lib: { buildStatistic },
};
