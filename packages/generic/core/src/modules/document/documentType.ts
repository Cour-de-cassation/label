import { buildDataModelEntry, graphQLTypeOfDataModel, typeOfDataModel } from '../dataModelType';

export { documentDataModel };

export type { documentType, fetchedDocumentType };

const documentDataModel = {
  creationDate: { type: buildDataModelEntry({ kind: 'primitive', content: 'date' }), graphQL: false },
  documentId: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), graphQL: false },
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), graphQL: true },
  metadata: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), graphQL: false },
  source: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), graphQL: false },
  status: {
    type: buildDataModelEntry({ kind: 'constant', content: ['done', 'free', 'pending', 'rejected', 'saved'] as const }),
    graphQL: true,
  },
  title: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), graphQL: true },
  text: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), graphQL: true },
} as const;

type documentType = typeOfDataModel<typeof documentDataModel>;

type fetchedDocumentType = graphQLTypeOfDataModel<typeof documentDataModel>;
