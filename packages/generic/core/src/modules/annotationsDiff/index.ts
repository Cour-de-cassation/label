import { annotationsDiffDataModelField, annotationsDiffType } from './annotationsDiffType';
import { squash } from './lib';

export { annotationsDiffModule };

export type { annotationsDiffType };

const annotationsDiffModule = {
  dataModelField: annotationsDiffDataModelField,
  lib: { squash },
};
