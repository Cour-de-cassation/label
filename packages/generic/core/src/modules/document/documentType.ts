import { dataModelType } from "../../types";
import { mongoIdType } from "../../utils";

export { documentDataModel, documentType };

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
