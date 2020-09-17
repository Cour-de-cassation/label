import {
  annotationType,
  courtDecisionGenerator,
  courtDecisionType,
  userType,
  generatorType,
} from "./lib";
import { buildMongoId, mongoIdType } from "./utils";

export {
  annotationType,
  courtDecisionGenerator,
  courtDecisionType,
  generatorType,
  buildMongoId,
  mongoIdType,
  CourtDecision,
  userType,
};

type CourtDecision = {
  id: number;
};
