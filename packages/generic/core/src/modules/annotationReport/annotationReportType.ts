import { mongoIdType } from "../../lib";

export type { annotationReportType };

type annotationReportType = {
  checkList: Array<string>;
  checkNeeded: boolean;
  documentId: mongoIdType;
  _id: mongoIdType;
};
