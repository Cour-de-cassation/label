import { buildDataModelEntry, networkTypeOfDataModel, typeOfDataModel } from '../dataModelType';

export { monitoringEntryDataModel };

export type { fetchedMonitoringEntryType, monitoringEntryType };

const monitoringEntryDataModel = {
  _id: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  action: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: true },
  creationDate: { type: buildDataModelEntry({ kind: 'primitive', content: 'number' }), network: true },
  documentId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: true },
  origin: {
    type: buildDataModelEntry({ kind: 'constant', content: ['document', 'panel', 'footer', 'shortcut'] }),
    network: true,
  },
  userId: { type: buildDataModelEntry({ kind: 'primitive', content: 'id' }), network: false },
} as const;

type monitoringEntryType = typeOfDataModel<typeof monitoringEntryDataModel>;

type fetchedMonitoringEntryType = networkTypeOfDataModel<typeof monitoringEntryDataModel>;
