import { annotationModule, annotationType } from './annotation';
import { annotationReportModule, annotationReportType } from './annotationReport';
import { annotationsDiffModule, annotationsDiffType } from './annotationsDiff';
import { assignationModule, assignationType } from './assignation';
import { cacheModule, cacheType } from './cache';
import { documentModule, documentType, fetchedDocumentType } from './document';
import { ressourceFilterModule, ressourceFilterType } from './ressourceFilter';
import { idModule, idType } from './id';
import { fetchedMonitoringEntryType, monitoringEntryModule, monitoringEntryType } from './monitoringEntry';
import { problemReportModule, problemReportType } from './problemReport';
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
  monitoringEntryModule,
  problemReportModule,
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
  fetchedMonitoringEntryType,
  migrationType,
  monitoringEntryType,
  problemReportType,
  settingsType,
  statisticType,
  categoryIconNameType,
  userType,
  passwordTimeValidityStatusType,
  treatmentType,
  treatmentInfoType,
};
