import { random } from "lodash";
import { generatorType } from "../../type";
import { entityType } from "../type";

export { entityGenerator };

const entityGenerator: generatorType<entityType> = {
  generate: (label) => (label ? label : `LABEL_${random(10 ** 10)}`),
};
