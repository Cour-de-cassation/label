import { monitoringEntryType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customMonitoringEntryRepositoryType } from './customMonitoringEntryRepositoryType';

export { buildFakeMonitoringEntryRepository };

const buildFakeMonitoringEntryRepository = buildFakeRepositoryBuilder<
  monitoringEntryType,
  customMonitoringEntryRepositoryType
>({
  buildCustomFakeRepository: (collection) => ({
    async insertMany(monitoringEntries) {
      collection.push(...monitoringEntries);
    },
  }),
});
