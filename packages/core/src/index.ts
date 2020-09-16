import {
  courtDecisionGenerator,
  courtDecisionType,
  generatorType,
} from "./lib";
import { buildMongoId, mongoIdType } from "./utils";

export {
  courtDecisionGenerator,
  courtDecisionType,
  generatorType,
  buildMongoId,
  mongoIdType,
  // TO BE REMOVED WHEN CLEANING
  maVariable,
  CourtDecision,
};

const maVariable = 1;

type CourtDecision = {
  id: number;
};
