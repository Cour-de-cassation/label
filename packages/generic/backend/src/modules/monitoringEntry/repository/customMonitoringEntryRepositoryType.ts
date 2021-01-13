import { monitoringEntryType } from '@label/core';

export type { customMonitoringEntryRepositoryType };

type customMonitoringEntryRepositoryType = {
  insertMany: (monitoringEntries: monitoringEntryType[]) => Promise<void>;
};
