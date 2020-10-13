import { annotationType, documentType, settingsType } from '@label/core';

export type { annotatorStateType, annotationActionType };

type annotatorStateType = {
  annotations: annotationType[];
  document: documentType;
  settings: settingsType;
};

type annotationActionType = {
  before: annotationType[];
  after: annotationType[];
};
