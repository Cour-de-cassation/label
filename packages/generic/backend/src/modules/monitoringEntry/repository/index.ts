import { dependencyManager } from '@label/core';
import { buildFakeMonitoringEntryRepository } from './buildFakeMonitoringEntryRepository';
import { buildMonitoringEntryRepository } from './buildMonitoringEntryRepository';

export { buildRepository as buildMonitoringEntryRepository };

const buildRepository = dependencyManager.inject({
  forLocal: buildMonitoringEntryRepository,
  forProd: buildMonitoringEntryRepository,
  forTest: buildFakeMonitoringEntryRepository,
});
