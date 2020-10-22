import { dataModelType, filterGraphQLKeysType } from "../../types";
import { idType } from "../id";

export { documentDataModel };

export type { documentType, fetchedDocumentType };

type documentType = {
  creationDate: Date;
  documentId: string;
  _id: idType;
  metadata: string;
  source: string;
  title: string;
  text: string;
};

const documentDataModel = {
  creationDate: { type: "date", graphQL: false },
  documentId: { type: "string", graphQL: false },
  _id: { type: "id", graphQL: true },
  metadata: { type: "string", graphQL: false },
  source: { type: "string", graphQL: false },
  title: { type: "string", graphQL: true },
  text: { type: "string", graphQL: true },
} as const;

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: dataModelType<documentType> = documentDataModel;

type fetchedDocumentType = Pick<
  documentType,
  filterGraphQLKeysType<typeof documentDataModel>
>;
