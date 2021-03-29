import { monitoringEntryType } from '@label/core';

export type { customMonitoringEntryRepositoryType };

type customMonitoringEntryRepositoryType = {
  deleteByDocumentId: (
    documentId: monitoringEntryType['documentId'],
  ) => Promise<void>;
  insertMany: (monitoringEntries: monitoringEntryType[]) => Promise<void>;
};
