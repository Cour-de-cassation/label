import { cacheModel, cacheType } from './cacheType';
import { cacheGenerator } from './generator';
import { buildCache } from './lib';

export { cacheModule };

export type { cacheType };

const cacheModule = {
  model: cacheModel,
  generator: cacheGenerator,
  lib: { buildCache },
};
