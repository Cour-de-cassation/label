import { buildDataModelEntry, typeOfDataModel } from '../dataModelType';

export { userDataModel };

export type { userType };

const userDataModel = {
  email: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: true },
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  password: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: false },
  role: { type: buildDataModelEntry({ kind: 'constant', content: ['admin', 'annotator'] as const }), network: true },
} as const;

type userType = typeOfDataModel<typeof userDataModel>;
