import { moduleType } from "../../types";
import { annotationGenerator } from "./generator";
import { annotationLib } from "./lib";
import { annotationType } from "./annotationType";

export { annotationModule, annotationType };

const annotationModule: moduleType<annotationType> = {
  generator: annotationGenerator,
  lib: annotationLib,
};
