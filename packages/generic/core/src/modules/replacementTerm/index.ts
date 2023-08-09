import { replacementTermModel, replacementTermType } from './replacementTermType';
import { replacementTermGenerator } from './generator';

export { replacementTermModule };

export type { replacementTermType };

const replacementTermModule = {
  model: replacementTermModel,
  generator: replacementTermGenerator,
  lib: {},
};
