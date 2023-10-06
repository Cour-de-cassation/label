import { annotationModule, annotationType } from './annotation';
import { annotationReportModule, annotationReportType } from './annotationReport';
import { annotationsDiffModule, annotationsDiffType } from './annotationsDiff';
import { assignationModule, assignationType } from './assignation';
import { cacheModule, cacheType } from './cache';
import { documentModule, documentType, fetchedDocumentType } from './document';
import { ressourceFilterModule, ressourceFilterType } from './ressourceFilter';
import { idModule, idType } from './id';
import { problemReportModule, problemReportType } from './problemReport';
import { replacementTermModule, replacementTermType } from './replacementTerm';
import {
  colorType,
  constantColorType,
  displayModeType,
  settingsModule,
  settingsType,
  shadeColorType,
  categoryIconNameType,
} from './settings';
import { statisticModule, statisticType } from './statistic';
import { treatmentType, treatmentModule, treatmentInfoType } from './treatment';
import { userModule, userType, passwordTimeValidityStatusType } from './user';
import { migrationModule, migrationType } from './migration';

export {
  annotationModule,
  annotationReportModule,
  annotationsDiffModule,
  assignationModule,
  cacheModule,
  documentModule,
  ressourceFilterModule,
  idModule,
  migrationModule,
  problemReportModule,
  replacementTermModule,
  settingsModule,
  statisticModule,
  treatmentModule,
  userModule,
};

export * from './modelType';

export type {
  annotationType,
  annotationReportType,
  annotationsDiffType,
  assignationType,
  cacheType,
  colorType,
  constantColorType,
  shadeColorType,
  displayModeType,
  documentType,
  fetchedDocumentType,
  ressourceFilterType,
  idType,
  migrationType,
  problemReportType,
  settingsType,
  statisticType,
  categoryIconNameType,
  userType,
  replacementTermType,
  passwordTimeValidityStatusType,
  treatmentType,
  treatmentInfoType,
};
