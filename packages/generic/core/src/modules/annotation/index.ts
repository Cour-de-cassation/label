import { annotationGenerator } from "./generator";
import { annotationDataModel, annotationType } from "./annotationType";
import { buildAnnotation, computeAnnotationEntityId } from "./lib";

export { annotationModule };

export type { annotationType };

const annotationModule = {
  dataModel: annotationDataModel,
  generator: annotationGenerator,
  lib: { buildAnnotation, computeAnnotationEntityId },
};
