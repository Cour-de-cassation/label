import {
  annotationModule,
  annotationType,
  courtDecisionModule,
  courtDecisionType,
  annotationEntityModule,
  annotationEntityType,
  annotationReportModule,
  annotationReportType,
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
  annotationReportModule,
  annotationReportType,
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
