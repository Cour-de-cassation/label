import { buildDataModelEntry, networkTypeOfDataModel, typeOfDataModel } from '../dataModelType';

export { documentDataModel };

export type { documentType, fetchedDocumentType };

const documentDataModel = {
  creationDate: { type: buildDataModelEntry({ kind: 'primitive', content: 'date' }), network: false },
  documentId: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: false },
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  metadata: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: false },
  source: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: false },
  status: {
    type: buildDataModelEntry({ kind: 'constant', content: ['done', 'free', 'pending', 'rejected', 'saved'] as const }),
    network: true,
  },
  title: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: true },
  text: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: true },
} as const;

type documentType = typeOfDataModel<typeof documentDataModel>;

type fetchedDocumentType = networkTypeOfDataModel<typeof documentDataModel>;
