import {
  annotationReportType,
  annotationType,
  assignationType,
  fetchedDocumentType,
  replacementTermType,
  settingsType,
} from '@label/core';

export type { annotatorStateType };

type annotatorStateType = {
  assignationId?: assignationType['_id'];
  annotations: annotationType[];
  document: fetchedDocumentType;
  settings: settingsType;
  mandatoryReplacementTerms: replacementTermType[];
  checklist: annotationReportType['checklist'];
};
