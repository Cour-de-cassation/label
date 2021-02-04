import React, { createContext, ReactElement, ReactNode, useState } from 'react';
import { fetchedMonitoringEntryType, fetchedDocumentType } from '@label/core';
import { buildMonitoringEntriesHandler, monitoringEntriesHandlerType } from './buildMonitoringEntriesHandler';
import { apiCaller } from '../../api';

export { MonitoringEntriesHandlerContext, MonitoringEntriesHandlerContextProvider };

const MonitoringEntriesHandlerContext = createContext<monitoringEntriesHandlerType>({
  addMonitoringEntry: () => null,
  resetMonitoringEntries: () => null,
  sendMonitoringEntries: async () => {},
});

function MonitoringEntriesHandlerContextProvider(props: {
  children: ReactNode;
  documentId: fetchedDocumentType['_id'];
}): ReactElement {
  const [monitoringEntries, setMonitoringEntries] = useState<fetchedMonitoringEntryType[]>([]);
  const monitoringEntriesHandler = buildMonitoringEntriesHandler(
    props.documentId,
    monitoringEntries,
    setMonitoringEntries,
    async (newMonitoringEntries: fetchedMonitoringEntryType[]) => {
      await uploadMonitoringEntries(newMonitoringEntries);
    },
  );

  return (
    <MonitoringEntriesHandlerContext.Provider value={monitoringEntriesHandler}>
      {props.children}
    </MonitoringEntriesHandlerContext.Provider>
  );

  async function uploadMonitoringEntries(newMonitoringEntries: fetchedMonitoringEntryType[]) {
    try {
      await apiCaller.post<'monitoringEntries'>('monitoringEntries', {
        newMonitoringEntries,
      });
    } catch (error) {
      console.warn(error);
    }
  }
}
