import { buildDataModelEntry, networkTypeOfDataModel, typeOfDataModel } from '../dataModelType';

export { treatmentDataModel };

export type { treatmentType, fetchedTreatmentType };

const annotationDataModelField = buildDataModelEntry({
  kind: 'object',
  content: {
    category: buildDataModelEntry({ kind: 'primitive', content: 'string' }),
    entityId: buildDataModelEntry({ kind: 'primitive', content: 'string' }),
    start: buildDataModelEntry({ kind: 'primitive', content: 'number' }),
    text: buildDataModelEntry({ kind: 'primitive', content: 'string' }),
  },
} as const);

const treatmentDataModel = {
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  documentId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  duration: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  order: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  userId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  before: {
    type: buildDataModelEntry({
      kind: 'list',
      content: annotationDataModelField,
    }),
    network: true,
  },
  after: {
    type: {
      kind: 'list',
      content: annotationDataModelField,
    },
    network: true,
  },
} as const;

type treatmentType = typeOfDataModel<typeof treatmentDataModel>;

type fetchedTreatmentType = networkTypeOfDataModel<typeof treatmentDataModel>;
