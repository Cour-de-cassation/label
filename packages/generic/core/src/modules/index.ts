import { annotationModule, annotationType } from "./annotation";
import {
  annotationReportModule,
  annotationReportType,
} from "./annotationReport";
import { assignationType } from "./assignation";
import { documentModule, documentType } from "./document";
import { settingsModule, settingsType } from "./settings";
import { userModule, userType } from "./user";

export {
  annotationModule,
  annotationReportModule,
  documentModule,
  settingsModule,
  userModule,
};

export type {
  annotationType,
  annotationReportType,
  assignationType,
  documentType,
  settingsType,
  userType,
};
