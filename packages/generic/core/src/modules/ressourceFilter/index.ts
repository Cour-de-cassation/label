import { ressourceFilterGenerator } from './generator';
import { ressourceFilterModel, ressourceFilterType } from './ressourceFilterType';

export { ressourceFilterModule };

export type { ressourceFilterType };

const ressourceFilterModule = {
  model: ressourceFilterModel,
  generator: ressourceFilterGenerator,
  lib: {},
};
