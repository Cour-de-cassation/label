import {
  annotationModule,
  annotationType,
  courtDecisionModule,
  courtDecisionType,
  nlpEntityModule,
  nlpEntityType,
  nlpReportModule,
  nlpReportType,
  userType,
} from "./modules";
import { generatorType } from "./types";
import { buildMongoId, mongoIdType } from "./utils";

export {
  annotationModule,
  annotationType,
  courtDecisionModule,
  courtDecisionType,
  nlpEntityModule,
  nlpEntityType,
  nlpReportModule,
  nlpReportType,
  userType,
  generatorType,
  buildMongoId,
  mongoIdType,
  CourtDecision,
};

type CourtDecision = {
  id: number;
};
