import { annotationsDiffDataModelField, annotationsDiffType } from './annotationsDiffType';
import { annotationsDiffGenerator } from './generator';
import { buildAnnotationsDiff, squash } from './lib';

export { annotationsDiffModule };

export type { annotationsDiffType };

const annotationsDiffModule = {
  dataModelField: annotationsDiffDataModelField,
  generator: annotationsDiffGenerator,
  lib: {
    buildAnnotationsDiff,
    squash,
  },
};
