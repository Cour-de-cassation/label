import { mongoIdType } from "../../utils";

export { nlpReportType };

type nlpReportType = {
  checkList: Array<string>;
  checkNeeded: boolean;
  courtDecisionId: mongoIdType;
  _id: mongoIdType;
};
