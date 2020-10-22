import {
  annotationModule,
  annotationType,
  fetchedAnnotationType,
} from "./annotation";
import {
  annotationReportModule,
  annotationReportType,
} from "./annotationReport";
import { assignationModule, assignationType } from "./assignation";
import { documentModule, documentType, fetchedDocumentType } from "./document";
import { idModule, idType } from "./id";
import { settingsModule, settingsType, categoryIconNameType } from "./settings";
import { userModule, userType } from "./user";

export {
  annotationModule,
  annotationReportModule,
  assignationModule,
  documentModule,
  idModule,
  settingsModule,
  userModule,
};

export type {
  annotationType,
  fetchedAnnotationType,
  annotationReportType,
  assignationType,
  documentType,
  fetchedDocumentType,
  idType,
  settingsType,
  categoryIconNameType,
  userType,
};
