import { monitoringEntryType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customMonitoringEntryRepositoryType } from './customMonitoringEntryRepositoryType';

export { buildMonitoringEntryRepository };

const buildMonitoringEntryRepository = buildRepositoryBuilder<
  monitoringEntryType,
  customMonitoringEntryRepositoryType
>({
  collectionName: 'monitoringEntries',
  buildCustomRepository: (collection) => ({
    async insertMany(monitoringEntries) {
      if (monitoringEntries.length === 0) {
        return;
      }
      await collection.insertMany(monitoringEntries);
    },
  }),
});
