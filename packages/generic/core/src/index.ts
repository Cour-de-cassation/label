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
  dataModelFieldType,
  dataModelType,
  generatorType,
  buildMongoId,
  mongoIdType,
  httpRequester,
  CourtDecision,
};

type CourtDecision = {
  _id: string;
};
