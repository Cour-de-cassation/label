import { buildMongoId } from "../../../utils";
import { generatorType } from "../../../types";
import { annotationEntityModule } from "../../annotationEntity";
import { annotationType } from "../annotationType";

export { annotationGenerator };

const annotationGenerator: generatorType<annotationType> = {
  generate: ({
    annotationEntity,
    courtDecisionId,
    _id,
    source,
    start,
    text,
  } = {}) => ({
    annotationEntity: annotationEntity
      ? annotationEntity
      : annotationEntityModule.generator.generate(),
    courtDecisionId: courtDecisionId
      ? buildMongoId(courtDecisionId)
      : buildMongoId(),
    _id: _id ? buildMongoId(_id) : buildMongoId(),
    source: source ? source : `SOURCE_${Math.random()}`,
    start: start ? start : 0,
    text: text ? text : `TEXT_${Math.random()}`,
  }),
};
