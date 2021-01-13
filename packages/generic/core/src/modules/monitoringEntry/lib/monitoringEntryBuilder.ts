import { idModule, idType } from '../../id';
import { fetchedMonitoringEntryType } from '../monitoringEntryType';

export { monitoringEntryBuilder };

const monitoringEntryBuilder = {
  buildFetchedMonitoringEntry,
};

function buildFetchedMonitoringEntry({
  description,
  documentId,
  type,
}: {
  description: string;
  documentId: idType;
  type: string;
}): fetchedMonitoringEntryType {
  return {
    creationDate: new Date().getTime(),
    description,
    documentId,
    _id: idModule.lib.buildId(),
    type,
  };
}
