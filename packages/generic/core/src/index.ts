import {
  annotationModule,
  annotationType,
  annotationEntityModule,
  annotationEntityType,
  annotationReportModule,
  annotationReportType,
  documentModule,
  documentType,
  userModule,
  userType,
} from "./modules";
import {
  dataModelFieldType,
  dataModelType,
  generatorType,
  omitMongoIdType,
} from "./types";
import { buildMongoId, mongoIdType, httpRequester } from "./utils";

export {
  annotationModule,
  annotationEntityModule,
  annotationReportModule,
  documentModule,
  userModule,
  buildMongoId,
  httpRequester,
};

export type {
  annotationType,
  annotationEntityType,
  annotationReportType,
  documentType,
  userType,
  dataModelFieldType,
  dataModelType,
  generatorType,
  omitMongoIdType,
  mongoIdType,
  CourtDecision,
};

type CourtDecision = {
  _id: string;
};
