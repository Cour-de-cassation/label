import {
  annotationModule,
  annotationType,
  courtDecisionModule,
  courtDecisionType,
  annotationEntityModule,
  annotationEntityType,
  annotationReportModule,
  annotationReportType,
  documentModule,
  documentType,
  userModule,
  userType,
} from "./modules";
import { dataModelFieldType, dataModelType, generatorType } from "./types";
import { buildMongoId, mongoIdType, httpRequester } from "./utils";

export {
  annotationModule,
  courtDecisionModule,
  annotationEntityModule,
  annotationReportModule,
  documentModule,
  userModule,
  buildMongoId,
  httpRequester,
};

export type {
  annotationType,
  courtDecisionType,
  annotationEntityType,
  annotationReportType,
  documentType,
  userType,
  dataModelFieldType,
  dataModelType,
  generatorType,
  mongoIdType,
  CourtDecision,
};

type CourtDecision = {
  _id: string;
};
