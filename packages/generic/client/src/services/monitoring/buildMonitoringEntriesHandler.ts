import { fetchedDocumentType, fetchedMonitoringEntryType, monitoringEntryModule } from '@label/core';

export { buildMonitoringEntriesHandler };

export type { monitoringEntriesHandlerType };

type monitoringEntriesHandlerType = {
  sendMonitoringEntries: () => void;
  addMonitoringEntry: (monitoringyEntryFields: { description: string; type: string }) => void;
  resetMonitoringEntries: () => void;
};

function buildMonitoringEntriesHandler(
  documentId: fetchedDocumentType['_id'],
  monitoringEntries: fetchedMonitoringEntryType[],
  setMonitoringEntries: (monitoringEntries: fetchedMonitoringEntryType[]) => void,
  uploadMonitoringEntries: (newMonitoringEntries: fetchedMonitoringEntryType[]) => Promise<void>,
): monitoringEntriesHandlerType {
  return {
    sendMonitoringEntries,
    addMonitoringEntry,
    resetMonitoringEntries,
  };

  async function sendMonitoringEntries() {
    await uploadMonitoringEntries(monitoringEntries);
  }

  function addMonitoringEntry(monitoringyEntryFields: { description: string; type: string }) {
    const newMonitoringEntry = monitoringEntryModule.lib.monitoringEntryBuilder.buildFetchedMonitoringEntry({
      ...monitoringyEntryFields,
      documentId,
    });
    setMonitoringEntries([...monitoringEntries, newMonitoringEntry]);
  }

  function resetMonitoringEntries() {
    setMonitoringEntries([]);
  }
}
