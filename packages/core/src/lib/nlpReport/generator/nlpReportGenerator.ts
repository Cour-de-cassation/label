import { buildMongoId } from "../../../utils";
import { generatorType } from "../../type";
import { nlpReportType } from "../nlpReportType";

export { nlpReportGenerator };

const nlpReportGenerator: generatorType<nlpReportType> = {
  generate: ({ checkList, checkNeeded, courtDecisionId } = {}) => ({
    checkList: checkList ? checkList : [],
    checkNeeded: checkNeeded ? checkNeeded : false,
    courtDecisionId: courtDecisionId
      ? buildMongoId(courtDecisionId)
      : buildMongoId(),
  }),
};
