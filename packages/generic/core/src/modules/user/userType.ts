import { buildDataModelEntry, typeOfDataModel } from '../dataModelType';

export { userDataModel };

export type { userType };

const userDataModel = {
  email: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: true },
  hashedPassword: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: false },
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  name: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: true },
  role: {
    type: buildDataModelEntry({
      kind: 'constant',
      content: ['admin', 'annotator', 'specialDocumentAnnotator'] as const,
    }),
    network: true,
  },
} as const;

type userType = typeOfDataModel<typeof userDataModel>;
