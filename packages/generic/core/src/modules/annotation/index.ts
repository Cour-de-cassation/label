import { annotationDataModelField, annotationType } from './annotationType';
import { annotationGenerator } from './generator';
import {
  annotationLinker,
  annotationUpdater,
  areOverlapping,
  buildAnnotation,
  comparator,
  entityIdHandler,
  sortAnnotations,
} from './lib';

export { annotationModule };

export type { annotationType };

const annotationModule = {
  dataModelField: annotationDataModelField,
  generator: annotationGenerator,
  lib: {
    annotationLinker,
    annotationUpdater,
    areOverlapping,
    buildAnnotation,
    comparator,
    entityIdHandler,
    sortAnnotations,
  },
};
