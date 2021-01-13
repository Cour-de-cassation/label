import { fetchedDocumentType, fetchedMonitoringEntryType, monitoringEntryModule } from '@label/core';

export { buildMonitoringEntriesHandler };

export type { monitoringEntriesHandlerType };

type monitoringEntriesHandlerType = {
  addMonitoringEntry: (monitoringyEntryFields: { description: string; type: string }) => void;
  getTotalDuration: () => number;
  resetMonitoringEntries: () => void;
  sendMonitoringEntries: () => Promise<void>;
};

function buildMonitoringEntriesHandler(
  documentId: fetchedDocumentType['_id'],
  monitoringEntries: fetchedMonitoringEntryType[],
  setMonitoringEntries: (monitoringEntries: fetchedMonitoringEntryType[]) => void,
  uploadMonitoringEntries: (newMonitoringEntries: fetchedMonitoringEntryType[]) => Promise<void>,
): monitoringEntriesHandlerType {
  return {
    addMonitoringEntry,
    getTotalDuration,
    resetMonitoringEntries,
    sendMonitoringEntries,
  };

  function addMonitoringEntry(monitoringyEntryFields: { description: string; type: string }) {
    const newMonitoringEntry = monitoringEntryModule.lib.monitoringEntryBuilder.buildFetchedMonitoringEntry({
      ...monitoringyEntryFields,
      documentId,
    });
    setMonitoringEntries([...monitoringEntries, newMonitoringEntry]);
  }

  function getTotalDuration() {
    const DURATION_THRESHOLD_BETWEEN_TIMESTAMPS = 5 * 60 * 1000;
    const timestamps = monitoringEntries.map((monitoringEntry) => monitoringEntry.creationDate);
    let duration = 0;
    for (let index = 0, numberOfTimestamps = timestamps.length; index < numberOfTimestamps; index++) {
      if (index === 0) {
        continue;
      }
      const durationBetweenTimestamps = timestamps[index] - timestamps[index - 1];
      if (durationBetweenTimestamps > DURATION_THRESHOLD_BETWEEN_TIMESTAMPS) {
        continue;
      }
      duration += durationBetweenTimestamps;
    }
    return duration;
  }

  function resetMonitoringEntries() {
    setMonitoringEntries([]);
  }

  async function sendMonitoringEntries() {
    await uploadMonitoringEntries(monitoringEntries);
  }
}
