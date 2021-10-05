import { annotationType, assignationType, fetchedDocumentType, settingsType } from '@label/core';

export type { annotatorStateType };

type annotatorStateType = {
  assignationId?: assignationType['_id'];
  annotations: annotationType[];
  document: fetchedDocumentType;
  settings: settingsType;
};
