import { buildMongoId } from "../../../utils";
import { generatorType } from "../../type";
import { nlpEntityGenerator } from "../../nlpEntity";
import { annotationType } from "../annotationType";

export { annotationGenerator };

const annotationGenerator: generatorType<annotationType> = {
  generate: ({ nlpEntity, courtDecisionId, source, start, text } = {}) => ({
    nlpEntity: nlpEntity ? nlpEntity : nlpEntityGenerator.generate(),
    courtDecisionId: courtDecisionId
      ? buildMongoId(courtDecisionId)
      : buildMongoId(),
    source: source ? source : `SOURCE_${Math.random()}`,
    start: start ? start : 0,
    text: text ? text : `TEXT_${Math.random()}`,
  }),
};
