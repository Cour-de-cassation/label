import { dataModelType, graphQLTypeOfDataModel, typeOfDataModel } from '../dataModelType';

export { treatmentDataModel };

export type { treatmentType, fetchedTreatmentType };

const annotationDataModelField = {
  category: 'string',
  entityId: 'string',
  start: 'number',
  text: 'string',
} as const;

const treatmentDataModel = {
  _id: { type: 'id', graphQL: true },
  documentId: { type: 'id', graphQL: true },
  duration: { type: 'number', graphQL: true },
  order: { type: 'number', graphQL: true },
  userId: { type: 'id', graphQL: true },
  before: {
    type: {
      kind: 'list',
      type: annotationDataModelField,
    },
    graphQL: true,
  },
  after: {
    type: {
      kind: 'list',
      type: annotationDataModelField,
    },
    graphQL: true,
  },
} as const;

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: dataModelType = treatmentDataModel;

type treatmentType = typeOfDataModel<typeof treatmentDataModel>;

type fetchedTreatmentType = graphQLTypeOfDataModel<typeof treatmentDataModel>;
