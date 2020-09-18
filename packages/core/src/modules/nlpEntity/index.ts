import { nlpEntityGenerator } from "./generator";
import { nlEntityLib } from "./lib";
import { nlpEntityType } from "./nlpEntityType";

export { nlpEntityModule, nlpEntityType };

const nlpEntityModule = {
  generator: nlpEntityGenerator,
  lib: nlEntityLib,
};
