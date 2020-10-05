import { mongoIdType } from "../../utils";

export type { annotationType };

type annotationType = {
  category: string;
  documentId: mongoIdType;
  source: string;
  _id: mongoIdType;
  start: number;
  text: string;
};
