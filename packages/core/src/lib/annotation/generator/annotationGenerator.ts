import { buildMongoId } from "../../../utils";
import { generatorType } from "../../type";
import { entityGenerator } from "../../entity";
import { annotationType } from "../annotationType";

export { annotationGenerator };

const annotationGenerator: generatorType<annotationType> = {
  generate: ({ entity, courtDecisionId, source, start, text } = {}) => ({
    entity: entity ? entity : entityGenerator.generate(),
    courtDecisionId: courtDecisionId
      ? buildMongoId(courtDecisionId)
      : buildMongoId(),
    source: source ? source : `SOURCE_${Math.random()}`,
    start: start ? start : 0,
    text: text ? text : `TEXT_${Math.random()}`,
  }),
};
