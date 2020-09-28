import { mongoIdType } from "../../utils";

export type { annotationReportType };

type annotationReportType = {
  checkList: Array<string>;
  checkNeeded: boolean;
  documentId: mongoIdType;
  _id: mongoIdType;
};
