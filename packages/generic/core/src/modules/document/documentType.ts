import { mongoIdType } from "../../utils";

export { documentType };

type documentType = {
  creationDate: Date;
  documentId: string;
  _id: mongoIdType;
  metadata: string;
  source: string;
  text: string;
};
