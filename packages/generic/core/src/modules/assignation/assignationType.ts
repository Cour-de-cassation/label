import { dataModelType, typeOfDataModel } from '../dataModelType';

export { assignationDataModel };

export type { assignationType };

const assignationDataModel = {
  documentId: { type: 'id', graphQL: true },
  _id: { type: 'id', graphQL: true },
  userId: { type: 'id', graphQL: true },
} as const;

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: dataModelType = assignationDataModel;

type assignationType = typeOfDataModel<typeof assignationDataModel>;
