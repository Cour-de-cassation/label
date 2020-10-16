import { dataModelType } from "../../types";
import { idType } from "../id";

export { annotationDataModel };

export type { annotationType };

type annotationType = {
  category: string;
  documentId: idType;
  entityId: string;
  source: string;
  _id: idType;
  start: number;
  text: string;
};

const annotationDataModel: dataModelType<annotationType> = {
  category: "string",
  documentId: "id",
  entityId: "string",
  source: "string",
  _id: "id",
  start: "number",
  text: "string",
};
