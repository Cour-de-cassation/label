import { monitoringEntryGenerator } from './generator';
import {
  fetchedMonitoringEntryModel,
  fetchedMonitoringEntryType,
  monitoringEntryModel,
  monitoringEntryType,
} from './monitoringEntryType';
import { monitoringEntryBuilder } from './lib';

export { monitoringEntryModule };

export type { fetchedMonitoringEntryType, monitoringEntryType };

const monitoringEntryModule = {
  fetchedModel: fetchedMonitoringEntryModel,
  model: monitoringEntryModel,
  generator: monitoringEntryGenerator,
  lib: {
    monitoringEntryBuilder,
  },
};
