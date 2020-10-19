import { dataModelType, filterGraphQLKeysType } from "../../types";
import { idType } from "../id";

export { annotationDataModel };

export type { annotationType, fetchedAnnotationType };

type annotationType = {
  category: string;
  documentId: idType;
  entityId: string;
  source: string;
  _id: idType;
  start: number;
  text: string;
};

const annotationDataModel = {
  category: { type: "string", graphQL: true },
  documentId: { type: "id", graphQL: false },
  entityId: { type: "string", graphQL: true },
  source: { type: "string", graphQL: false },
  _id: { type: "id", graphQL: true },
  start: { type: "number", graphQL: true },
  text: { type: "string", graphQL: true },
} as const;

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: dataModelType<annotationType> = annotationDataModel;

type fetchedAnnotationType = Pick<
  annotationType,
  filterGraphQLKeysType<typeof annotationDataModel>
>;
