import { buildDataModelEntry, typeOfDataModel } from '../dataModelType';

export { assignationDataModel };

export type { assignationType };

const assignationDataModel = {
  documentId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), graphQL: true },
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), graphQL: true },
  userId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), graphQL: true },
} as const;

type assignationType = typeOfDataModel<typeof assignationDataModel>;
