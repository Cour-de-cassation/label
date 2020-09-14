import { courtDecisionGenerator, courtDecisionType } from "./lib";
import { buildMongoId, mongoIdType } from "./utils";

export {
  courtDecisionGenerator,
  courtDecisionType,
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
