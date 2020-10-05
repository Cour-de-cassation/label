import { annotationGenerator } from "./generator";
import { annotationLib } from "./lib";
import { annotationDataModel, annotationType } from "./annotationType";

export { annotationModule };

export type { annotationType };

const annotationModule = {
  dataModel: annotationDataModel,
  generator: annotationGenerator,
  lib: annotationLib,
};
