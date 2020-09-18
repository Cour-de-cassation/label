import {
  annotationModule,
  annotationType,
  courtDecisionModule,
  courtDecisionType,
  nlpEntityModule,
  nlpEntityType,
  nlpReportModule,
  nlpReportType,
  userModule,
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
  userModule,
  userType,
  generatorType,
  buildMongoId,
  mongoIdType,
  CourtDecision,
};

type CourtDecision = {
  id: number;
};
