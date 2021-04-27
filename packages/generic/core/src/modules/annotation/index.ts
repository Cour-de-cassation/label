import { annotationModel, annotationType } from './annotationType';
import { annotationGenerator } from './generator';
import {
  annotationLinker,
  annotationUpdater,
  areOverlapping,
  buildAnnotation,
  comparator,
  computeNearbyText,
  entityIdHandler,
  sortAnnotations,
} from './lib';

export { annotationModule };

export type { annotationType };

const annotationModule = {
  model: annotationModel,
  generator: annotationGenerator,
  lib: {
    annotationLinker,
    annotationUpdater,
    areOverlapping,
    buildAnnotation,
    comparator,
    computeNearbyText,
    entityIdHandler,
    sortAnnotations,
  },
};
