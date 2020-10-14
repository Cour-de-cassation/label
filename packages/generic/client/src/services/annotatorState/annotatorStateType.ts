import { settingsType } from '@label/core';
import { fetchedAnnotationType, fetchedDocumentType } from '../../types';

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
