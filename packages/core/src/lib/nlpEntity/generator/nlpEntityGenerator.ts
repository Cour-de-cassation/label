import { random } from "lodash";
import { generatorType } from "../../type";
import { nlEntityLib } from "../lib";
import { nlpEntityType } from "../nlpEntityType";

export { nlpEntityGenerator };

const nlpEntityGenerator: generatorType<nlpEntityType> = {
  generate: (label) => (label ? label : nlEntityLib.buildNlpEntity("LABEL")),
};
