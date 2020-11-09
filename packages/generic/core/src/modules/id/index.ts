import { idType, omitIdType } from './idType';
import { buildId, convertToString, equalId } from './lib';

export { idModule };

export type { idType, omitIdType };

const idModule = {
  lib: { buildId, convertToString, equalId },
};
