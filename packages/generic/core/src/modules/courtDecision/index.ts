import { courtDecisionGenerator } from "./generator";
import { courtDecisionType } from "./courtDecisionType";

export { courtDecisionModule };

export type { courtDecisionType };

const courtDecisionModule = {
  generator: courtDecisionGenerator,
  lib: undefined,
};
