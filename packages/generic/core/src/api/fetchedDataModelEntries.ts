import {
  annotationModule,
  documentModule,
  monitoringEntryModule,
  settingsModule,
  dataModelEntryType,
  problemReportModule,
  treatmentModule,
} from '../modules';

import { filterGraphQLKeysType } from '../types';

export { fetchedDataModelEntries };

const fetchedDataModelEntries = {
  annotation: {
    kind: 'object',
    content: buildFetchedDataModelEntry<typeof annotationModule.dataModel>(annotationModule.dataModel),
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
} as const;

function buildFetchedDataModelEntry<
  dataModelT extends {
    [field: string]: { graphQL: boolean; type: dataModelEntryType };
  }
>(
  dataModel: dataModelT,
): {
  [k in keyof Pick<dataModelT, filterGraphQLKeysType<dataModelT>>]: dataModelT[k]['type'];
} {
  const fetchedDataModelEntry = {} as {
    [field in keyof dataModelT]: dataModelEntryType;
  };

  for (const key in dataModel) {
    if (dataModel[key].graphQL) {
      fetchedDataModelEntry[key] = dataModel[key].type;
    }
  }

  return fetchedDataModelEntry;
}
