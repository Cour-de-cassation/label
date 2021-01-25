import { buildDataModelEntry, typeOfDataModel } from '../dataModelType';

export { assignationDataModel };

export type { assignationType };

const assignationDataModel = {
  documentId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  treatmentId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  userId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
} as const;

type assignationType = typeOfDataModel<typeof assignationDataModel>;
