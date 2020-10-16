import { idType, omitIdType } from "./idType";
import { buildId, buildObjectWithId, equalId } from "./lib";

export { idModule };

export type { idType, omitIdType };

const idModule = {
  lib: { buildId, buildObjectWithId, equalId },
};
