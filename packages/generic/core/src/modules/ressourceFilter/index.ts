import { ressourceFilterGenerator } from './generator';
import { filterTreatedDocuments } from './lib';
import { ressourceFilterModel, ressourceFilterType } from './ressourceFilterType';

export { ressourceFilterModule };

export type { ressourceFilterType };

const ressourceFilterModule = {
  model: ressourceFilterModel,
  generator: ressourceFilterGenerator,
  lib: { filterTreatedDocuments },
};
