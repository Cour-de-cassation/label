import { dataModelType, graphQLTypeOfDataModel, typeOfDataModel } from '../dataModelType';

export { monitoringEntryDataModel };

export type { fetchedMonitoringEntryType, monitoringEntryType };

const monitoringEntryDataModel = {
  description: { type: 'string', graphQL: true },
  documentId: { type: 'id', graphQL: true },
  _id: { type: 'id', graphQL: true },
  type: { type: 'string', graphQL: true },
  userId: { type: 'id', graphQL: false },
} as const;

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: dataModelType = monitoringEntryDataModel;

type monitoringEntryType = typeOfDataModel<typeof monitoringEntryDataModel>;

type fetchedMonitoringEntryType = graphQLTypeOfDataModel<typeof monitoringEntryDataModel>;
