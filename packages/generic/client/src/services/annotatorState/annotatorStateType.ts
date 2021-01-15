import { annotationType, fetchedDocumentType, settingsType } from '@label/core';

export type { annotatorStateType };

type annotatorStateType = {
  annotations: annotationType[];
  document: fetchedDocumentType;
  settings: settingsType;
};
