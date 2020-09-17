import { random } from "lodash";
import { nlpEntityType } from "../nlpEntityType";

export { buildNlpEntity };

function buildNlpEntity(label: string): nlpEntityType {
  return `${label}_${random(10 ** 10)}`;
}
