import {
  dataModelType,
  graphQLTypeOfDataModel,
  typeOfDataModel,
} from "../dataModelType";

export { annotationDataModel };

export type { annotationType, fetchedAnnotationType };

const annotationDataModel = {
  category: { type: "string", graphQL: true },
  documentId: { type: "id", graphQL: false },
  entityId: { type: "string", graphQL: true },
  source: { type: "string", graphQL: true },
  _id: { type: "id", graphQL: true },
  start: { type: "number", graphQL: true },
  text: { type: "string", graphQL: true },
} as const;

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: dataModelType = annotationDataModel;

type annotationType = typeOfDataModel<typeof annotationDataModel>;

type fetchedAnnotationType = graphQLTypeOfDataModel<typeof annotationDataModel>;
