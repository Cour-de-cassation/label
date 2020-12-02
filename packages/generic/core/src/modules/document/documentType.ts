import { dataModelType, graphQLTypeOfDataModel, typeOfDataModel } from '../dataModelType';

export { documentDataModel };

export type { documentType, fetchedDocumentType };

const documentDataModel = {
  creationDate: { type: 'date', graphQL: false },
  documentId: { type: 'string', graphQL: false },
  _id: { type: 'id', graphQL: true },
  metadata: { type: 'string', graphQL: false },
  source: { type: 'string', graphQL: false },
  status: { type: ['done', 'free', 'pending', 'rejected', 'saved'], graphQL: true },
  title: { type: 'string', graphQL: true },
  text: { type: 'string', graphQL: true },
} as const;

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: dataModelType = documentDataModel;

type documentType = typeOfDataModel<typeof documentDataModel>;

type fetchedDocumentType = graphQLTypeOfDataModel<typeof documentDataModel>;
