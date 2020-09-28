import { mongoIdType } from "../../utils";

export { annotationReportType };

type annotationReportType = {
  checkList: Array<string>;
  checkNeeded: boolean;
  documentId: mongoIdType;
  _id: mongoIdType;
};
