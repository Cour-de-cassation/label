import {
  annotationReportModule,
  documentModule,
  monitoringEntryModule,
  settingsModule,
  dataModelEntryType,
  problemReportModule,
  treatmentModule,
  userModule,
} from '../modules';

import { filterNetworkKeysType } from '../types';

export { fetchedDataModelEntries };

const fetchedDataModelEntries = {
  annotationReport: {
    kind: 'object',
    content: buildFetchedDataModelEntry<typeof annotationReportModule.dataModel>(annotationReportModule.dataModel),
  },
  document: {
    kind: 'object',
    content: buildFetchedDataModelEntry<typeof documentModule.dataModel>(documentModule.dataModel),
  },
  monitoringEntry: {
    kind: 'object',
    content: buildFetchedDataModelEntry<typeof monitoringEntryModule.dataModel>(monitoringEntryModule.dataModel),
  },
  problemReport: {
    kind: 'object',
    content: buildFetchedDataModelEntry<typeof problemReportModule.dataModel>(problemReportModule.dataModel),
  },
  settings: {
    kind: 'object',
    content: buildFetchedDataModelEntry<typeof settingsModule.dataModel>(settingsModule.dataModel),
  },
  treatment: {
    kind: 'object',
    content: buildFetchedDataModelEntry<typeof treatmentModule.dataModel>(treatmentModule.dataModel),
  },
  user: {
    kind: 'object',
    content: buildFetchedDataModelEntry<typeof userModule.dataModel>(userModule.dataModel),
  },
} as const;

function buildFetchedDataModelEntry<
  dataModelT extends {
    [field: string]: { network: boolean; type: dataModelEntryType };
  }
>(
  dataModel: dataModelT,
): {
  [k in keyof Pick<dataModelT, filterNetworkKeysType<dataModelT>>]: dataModelT[k]['type'];
} {
  const fetchedDataModelEntry = {} as {
    [field in keyof dataModelT]: dataModelEntryType;
  };

  for (const key in dataModel) {
    if (dataModel[key].network) {
      fetchedDataModelEntry[key] = dataModel[key].type;
    }
  }

  return fetchedDataModelEntry;
}
