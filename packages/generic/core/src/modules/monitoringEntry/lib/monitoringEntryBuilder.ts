import { idModule } from '../../id';
import { fetchedMonitoringEntryType } from '../monitoringEntryType';

export { monitoringEntryBuilder };

const monitoringEntryBuilder = {
  buildFetchedMonitoringEntry,
};

function buildFetchedMonitoringEntry({
  action,
  documentId,
  origin,
}: Pick<fetchedMonitoringEntryType, 'action' | 'documentId' | 'origin'>): fetchedMonitoringEntryType {
  return {
    _id: idModule.lib.buildId(),
    action,
    creationDate: new Date().getTime(),
    documentId,
    origin,
  };
}
