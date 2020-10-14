import { documentType, settingsType } from '@label/core';
import { fetchedAnnotationType } from '../../types';

export type { annotatorStateType, annotationActionType };

type annotatorStateType = {
  annotations: fetchedAnnotationType[];
  document: documentType;
  settings: settingsType;
};

type annotationActionType = {
  before: fetchedAnnotationType[];
  after: fetchedAnnotationType[];
};
