import { annotationGenerator } from "./generator";
import {
  annotationDataModel,
  annotationType,
  fetchedAnnotationType,
} from "./annotationType";
import { buildAnnotation, computeAnnotationEntityId } from "./lib";

export { annotationModule };

export type { annotationType, fetchedAnnotationType };

const annotationModule = {
  dataModel: annotationDataModel,
  generator: annotationGenerator,
  lib: { buildAnnotation, computeAnnotationEntityId },
};
