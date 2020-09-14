import { generatorType } from "../../type";
import { entityGenerator } from "../../entity";
import { annotationType } from "../type";

export { annotationGenerator };

const annotationGenerator: generatorType<annotationType> = {
  generate: ({ entity, source, start, text } = {}) => ({
    entity: entity ? entity : entityGenerator.generate(),
    source: source ? source : `SOURCE_${Math.random()}`,
    start: start ? start : 0,
    text: text ? text : `TEXT_${Math.random()}`,
  }),
};
