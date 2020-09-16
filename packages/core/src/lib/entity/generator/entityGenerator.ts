import { random } from "lodash";
import { generatorType } from "../../type";
import { entityType } from "../entityType";

export { entityGenerator };

const entityGenerator: generatorType<entityType> = {
  generate: (label) => (label ? label : `LABEL_${random(10 ** 10)}`),
};
