import { buildDataModelEntry, typeOfDataModel } from '../dataModelType';

export { userDataModel };

export type { userType };

const userDataModel = {
  email: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), graphQL: true },
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), graphQL: true },
  password: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), graphQL: false },
  role: { type: buildDataModelEntry({ kind: 'constant', content: ['admin', 'annotator'] as const }), graphQL: true },
} as const;

type userType = typeOfDataModel<typeof userDataModel>;
