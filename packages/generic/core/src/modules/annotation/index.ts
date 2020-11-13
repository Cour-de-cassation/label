import { annotationGenerator } from './generator';
import { annotationDataModel, annotationType, fetchedAnnotationType } from './annotationType';
import {
  annotationLinker,
  annotationUpdater,
  buildAnnotation,
  buildFetchedAnnotation,
  entityIdHandler,
  fetchedAnnotationHandler,
} from './lib';

export { annotationModule };

export type { annotationType, fetchedAnnotationType };

const annotationModule = {
  dataModel: annotationDataModel,
  generator: annotationGenerator,
  lib: {
    annotationLinker,
    annotationUpdater,
    buildAnnotation,
    buildFetchedAnnotation,
    entityIdHandler,
    fetchedAnnotationHandler,
  },
};
