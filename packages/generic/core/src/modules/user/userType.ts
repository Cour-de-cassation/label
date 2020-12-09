import { dataModelType, typeOfDataModel } from '../dataModelType';

export { userDataModel };

export type { userType };

const userDataModel = {
  email: { type: 'string', graphQL: true },
  _id: { type: 'id', graphQL: true },
  password: { type: 'string', graphQL: false },
  role: { type: ['admin', 'annotator'], graphQL: true },
} as const;

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: dataModelType = userDataModel;

type userType = typeOfDataModel<typeof userDataModel>;
