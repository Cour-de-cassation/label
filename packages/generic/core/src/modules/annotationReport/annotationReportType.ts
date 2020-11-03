import { idType } from '../id';

export type { annotationReportType };

type annotationReportType = {
  checkList: Array<string>;
  checkNeeded: boolean;
  documentId: idType;
  _id: idType;
};
