import { fetchedAnnotationType, fetchedDocumentType, settingsType } from '@label/core';

export type { annotatorStateType, annotationActionType };

type annotatorStateType = {
  annotations: fetchedAnnotationType[];
  document: fetchedDocumentType;
  settings: settingsType;
};

type annotationActionType = {
  before: fetchedAnnotationType[];
  after: fetchedAnnotationType[];
};
