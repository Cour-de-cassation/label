import {
  annotationModule,
  annotationType,
  courtDecisionModule,
  courtDecisionType,
  annotationEntityModule,
  annotationEntityType,
  nlpReportModule,
  nlpReportType,
  userModule,
  userType,
} from "./modules";
import { generatorType } from "./types";
import { buildMongoId, mongoIdType, httpRequester } from "./utils";

export {
  annotationModule,
  annotationType,
  courtDecisionModule,
  courtDecisionType,
  annotationEntityModule,
  annotationEntityType,
  nlpReportModule,
  nlpReportType,
  userModule,
  userType,
  generatorType,
  buildMongoId,
  mongoIdType,
  httpRequester,
  CourtDecision,
};

type CourtDecision = {
  _id: string;
};
