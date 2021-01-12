import { buildDataModelEntry, graphQLTypeOfDataModel, typeOfDataModel } from '../dataModelType';

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
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), graphQL: true },
  documentId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), graphQL: true },
  duration: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), graphQL: true },
  order: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), graphQL: true },
  userId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), graphQL: true },
  before: {
    type: buildDataModelEntry({
      kind: 'list',
      content: annotationDataModelField,
    }),
    graphQL: true,
  },
  after: {
    type: {
      kind: 'list',
      content: annotationDataModelField,
    },
    graphQL: true,
  },
} as const;

type treatmentType = typeOfDataModel<typeof treatmentDataModel>;

type fetchedTreatmentType = graphQLTypeOfDataModel<typeof treatmentDataModel>;
