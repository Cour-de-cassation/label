import { dataModelType } from "../../types";
import { mongoIdType } from "../../utils";

export { annotationDataModel };

export type { annotationType };

type annotationType = {
  category: string;
  documentId: mongoIdType;
  source: string;
  _id: mongoIdType;
  start: number;
  text: string;
};

const annotationDataModel: dataModelType<annotationType> = {
  category: "string",
  documentId: "mongoIdType",
  source: "string",
  _id: "mongoIdType",
  start: "number",
  text: "string",
};
