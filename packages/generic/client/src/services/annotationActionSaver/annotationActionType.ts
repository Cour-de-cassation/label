import { annotationType } from '@label/core';

export type { annotationActionType };

type annotationActionType = {
  before: annotationType[];
  after: annotationType[];
};
