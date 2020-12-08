import { monitoringEntryType } from '@label/core';
import { buildMonitoringEntryRepository } from '../repository';

export { monitoringEntryService };

const monitoringEntryService = {
  async create(monitoringEntry: monitoringEntryType) {
    const monitoringEntryRepository = buildMonitoringEntryRepository();

    await monitoringEntryRepository.insert(monitoringEntry);
  },
};
