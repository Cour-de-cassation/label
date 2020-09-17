import { moduleType } from "../../types";
import { courtDecisionGenerator } from "./generator";
import { courtDecisionType } from "./courtDecisionType";

export { courtDecisionModule, courtDecisionType };

const courtDecisionModule: moduleType<courtDecisionType> = {
  generator: courtDecisionGenerator,
  lib: undefined,
};
