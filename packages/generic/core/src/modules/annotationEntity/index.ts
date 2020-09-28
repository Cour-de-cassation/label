import { annotationEntityGenerator } from "./generator";
import { annotationEntityLib } from "./lib";
import { annotationEntityType } from "./annotationEntityType";

export { annotationEntityModule, annotationEntityType };

const annotationEntityModule = {
  generator: annotationEntityGenerator,
  lib: annotationEntityLib,
};
