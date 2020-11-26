import { annotationGenerator } from './generator';
import { annotationDataModel, annotationType, LABEL_ANNOTATION_SOURCE, fetchedAnnotationType } from './annotationType';
import { annotationBuilder, annotationLinker, annotationUpdater, entityIdHandler } from './lib';

export { annotationModule };

export type { annotationType, fetchedAnnotationType };

const annotationModule = {
  config: { LABEL_ANNOTATION_SOURCE },
  dataModel: annotationDataModel,
  generator: annotationGenerator,
  lib: {
    annotationBuilder,
    annotationLinker,
    annotationUpdater,
    entityIdHandler,
  },
};
