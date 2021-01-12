import { buildDataModelEntry, graphQLTypeOfDataModel, typeOfDataModel } from '../dataModelType';

export { monitoringEntryDataModel };

export type { fetchedMonitoringEntryType, monitoringEntryType };

const monitoringEntryDataModel = {
  description: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), graphQL: true },
  documentId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), graphQL: true },
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), graphQL: true },
  type: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), graphQL: true },
  userId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), graphQL: false },
} as const;

type monitoringEntryType = typeOfDataModel<typeof monitoringEntryDataModel>;

type fetchedMonitoringEntryType = graphQLTypeOfDataModel<typeof monitoringEntryDataModel>;
