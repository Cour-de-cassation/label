import { monitoringEntryModule } from '@label/core';
import { useGraphQLMutation } from '../../graphQL';
import { annotatorStateHandlerType } from '../annotatorState';

export { useMonitoring };

function useMonitoring(annotatorStateHandler: annotatorStateHandlerType) {
  const [sendNewMonitoryEntry] = useGraphQLMutation<'monitoringEntry'>('monitoringEntry');

  const addMonitoringEntry = (monitoryEntryFields: { description: string; type: string }) =>
    sendNewMonitoryEntry({
      variables: {
        newMonitoringEntry: monitoringEntryModule.lib.monitoringEntryBuilder.buildFetchedMonitoringEntry({
          ...monitoryEntryFields,
          documentId: annotatorStateHandler.get().document._id,
        }),
      },
    });

  return { addMonitoringEntry };
}
