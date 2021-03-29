import { monitoringEntryType } from '@label/core';
import { buildMonitoringEntryRepository } from '../repository';

export { monitoringEntryService };

const monitoringEntryService = {
  async createMany(monitoringEntries: monitoringEntryType[]) {
    const monitoringEntryRepository = buildMonitoringEntryRepository();
    return monitoringEntryRepository.insertMany(monitoringEntries);
  },

  async deleteMonitoringEntriesByDocumentId(
    documentId: monitoringEntryType['documentId'],
  ) {
    const monitoringEntryRepository = buildMonitoringEntryRepository();
    await monitoringEntryRepository.deleteByDocumentId(documentId);
  },

  async fetchAllMonitoringEntries() {
    const monitoringEntryRepository = buildMonitoringEntryRepository();
    return monitoringEntryRepository.findAll();
  },
};
