import { monitoringEntryGenerator } from './generator';
import { fetchedMonitoringEntryType, monitoringEntryDataModel, monitoringEntryType } from './monitoringEntryType';
import { monitoringEntryBuilder } from './lib';

export { monitoringEntryModule };

export type { fetchedMonitoringEntryType, monitoringEntryType };

const monitoringEntryModule = {
  dataModel: monitoringEntryDataModel,
  generator: monitoringEntryGenerator,
  lib: {
    monitoringEntryBuilder,
  },
};
