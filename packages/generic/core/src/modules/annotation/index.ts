import { annotationGenerator } from "./generator";
import {
  annotationDataModel,
  annotationType,
  fetchedAnnotationType,
} from "./annotationType";
import { annotationLinker, buildAnnotation, entityIdHandler } from "./lib";

export { annotationModule };

export type { annotationType, fetchedAnnotationType };

const annotationModule = {
  dataModel: annotationDataModel,
  generator: annotationGenerator,
  lib: { annotationLinker, buildAnnotation, entityIdHandler },
};
