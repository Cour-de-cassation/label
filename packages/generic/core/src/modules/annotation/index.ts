import { annotationGenerator } from "./generator";
import { annotationLib } from "./lib";
import { annotationType } from "./annotationType";

export { annotationModule };

export type { annotationType };

const annotationModule = {
  generator: annotationGenerator,
  lib: annotationLib,
};
