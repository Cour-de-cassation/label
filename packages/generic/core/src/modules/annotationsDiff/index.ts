import { annotationsDiffModel, annotationsDiffType } from './annotationsDiffType';
import { annotationsDiffGenerator } from './generator';
import {
  applyToAnnotations,
  areAnnotationsDiffCompatibleWithAnnotations,
  buildAnnotationsDiff,
  computeAnnotationsDiff,
  computeDetailsFromAnnotationsDiff,
  inverse,
  squash,
} from './lib';

export { annotationsDiffModule };

export type { annotationsDiffType };

const annotationsDiffModule = {
  model: annotationsDiffModel,
  generator: annotationsDiffGenerator,
  lib: {
    applyToAnnotations,
    areAnnotationsDiffCompatibleWithAnnotations,
    buildAnnotationsDiff,
    computeAnnotationsDiff,
    computeDetailsFromAnnotationsDiff,
    inverse,
    squash,
  },
};
