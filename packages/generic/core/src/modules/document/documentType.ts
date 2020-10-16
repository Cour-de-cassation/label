import { mongoIdType } from "../../lib";
import { dataModelType } from "../../types";

export { documentDataModel };

export type { documentType };

type documentType = {
  creationDate: Date;
  documentId: string;
  _id: mongoIdType;
  metadata: string;
  source: string;
  text: string;
};

const documentDataModel: dataModelType<documentType> = {
  creationDate: "date",
  documentId: "string",
  _id: "mongoIdType",
  metadata: "string",
  source: "string",
  text: "string",
};
