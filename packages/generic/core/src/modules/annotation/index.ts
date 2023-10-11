import { annotationModel, annotationType } from './annotationType';
import { annotationGenerator } from './generator';
import {
  annotationLinker,
  annotationUpdater,
  areAnnotationsIncluded,
  areOverlapping,
  buildAnnotation,
  comparator,
  computeNearbyText,
  entityIdHandler,
  removeOverlappingAnnotations,
  isAnnotationTextInAnnotations,
  sortAnnotations,
  stringify,
} from './lib';

export { annotationModule, buildAnnotation };

export type { annotationType };

const annotationModule = {
  model: annotationModel,
  generator: annotationGenerator,
  lib: {
    annotationLinker,
    annotationUpdater,
    areAnnotationsIncluded,
    areOverlapping,
    buildAnnotation,
    comparator,
    computeNearbyText,
    entityIdHandler,
    removeOverlappingAnnotations,
    isAnnotationTextInAnnotations,
    sortAnnotations,
    stringify,
  },
};
