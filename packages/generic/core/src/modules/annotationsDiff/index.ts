import { annotationsDiffDataModelField, annotationsDiffType } from './annotationsDiffType';
import { annotationsDiffGenerator } from './generator';
import { applyToAnnotations, buildAnnotationsDiff, computeAnnotationsDiff, inverse, squash } from './lib';

export { annotationsDiffModule };

export type { annotationsDiffType };

const annotationsDiffModule = {
  dataModelField: annotationsDiffDataModelField,
  generator: annotationsDiffGenerator,
  lib: {
    applyToAnnotations,
    buildAnnotationsDiff,
    computeAnnotationsDiff,
    inverse,
    squash,
  },
};
