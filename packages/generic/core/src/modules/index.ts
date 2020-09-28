import { annotationModule, annotationType } from "./annotation";
import { courtDecisionModule, courtDecisionType } from "./courtDecision";
import {
  annotationEntityModule,
  annotationEntityType,
} from "./annotationEntity";
import {
  annotationReportModule,
  annotationReportType,
} from "./annotationReport";
import { documentModule, documentType } from "./document";
import { userModule, userType } from "./user";

export {
  annotationModule,
  courtDecisionModule,
  annotationEntityModule,
  annotationReportModule,
  documentModule,
  userModule,
};

export type {
  annotationType,
  courtDecisionType,
  annotationEntityType,
  annotationReportType,
  documentType,
  userType,
};
