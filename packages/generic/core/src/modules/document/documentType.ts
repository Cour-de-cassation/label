import { dataModelType } from "../../types";
import { idType } from "../id";

export { documentDataModel };

export type { documentType };

type documentType = {
  creationDate: Date;
  documentId: string;
  _id: idType;
  metadata: string;
  source: string;
  text: string;
};

const documentDataModel: dataModelType<documentType> = {
  creationDate: "date",
  documentId: "string",
  _id: "id",
  metadata: "string",
  source: "string",
  text: "string",
};
