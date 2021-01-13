import { buildDataModelEntry, networkTypeOfDataModel, typeOfDataModel } from '../dataModelType';

export { monitoringEntryDataModel };

export type { fetchedMonitoringEntryType, monitoringEntryType };

const monitoringEntryDataModel = {
  creationDate: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  description: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: true },
  documentId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  type: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: true },
  userId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: false },
} as const;

type monitoringEntryType = typeOfDataModel<typeof monitoringEntryDataModel>;

type fetchedMonitoringEntryType = networkTypeOfDataModel<typeof monitoringEntryDataModel>;
