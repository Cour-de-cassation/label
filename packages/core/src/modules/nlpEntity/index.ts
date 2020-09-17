import { moduleType } from "../../types";
import { nlpEntityGenerator } from "./generator";
import { nlEntityLib } from "./lib";
import { nlpEntityType } from "./nlpEntityType";

export { nlpEntityModule, nlpEntityType };

const nlpEntityModule: moduleType<nlpEntityType> = {
  generator: nlpEntityGenerator,
  lib: nlEntityLib,
};
