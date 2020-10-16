import { idType, omitIdType } from "./idType";
import { buildId, buildObjectWithId, convertToString, equalId } from "./lib";

export { idModule };

export type { idType, omitIdType };

const idModule = {
  lib: { buildId, buildObjectWithId, convertToString, equalId },
};
