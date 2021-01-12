import { monitoringEntryModule } from '@label/core';
import { apiCaller } from '../../api';
import { annotatorStateHandlerType } from '../annotatorState';

export { useMonitoring };

function useMonitoring(annotatorStateHandler: annotatorStateHandlerType) {
  const addMonitoringEntry = (monitoryEntryFields: { description: string; type: string }) =>
    apiCaller.post<'monitoringEntry'>('monitoringEntry', {
      newMonitoringEntry: monitoringEntryModule.lib.monitoringEntryBuilder.buildFetchedMonitoringEntry({
        ...monitoryEntryFields,
        documentId: annotatorStateHandler.get().document._id,
      }),
    });

  return { addMonitoringEntry };
}
