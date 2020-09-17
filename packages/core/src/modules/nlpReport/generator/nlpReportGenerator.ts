import { buildMongoId } from "../../../utils";
import { generatorType } from "../../../types";
import { nlpReportType } from "../nlpReportType";

export { nlpReportGenerator };

const nlpReportGenerator: generatorType<nlpReportType> = {
  generate: ({ checkList, checkNeeded, courtDecisionId, _id } = {}) => ({
    checkList: checkList ? checkList : [],
    checkNeeded: checkNeeded ? checkNeeded : false,
    courtDecisionId: courtDecisionId
      ? buildMongoId(courtDecisionId)
      : buildMongoId(),
    _id: _id ? buildMongoId(_id) : buildMongoId(),
  }),
};
