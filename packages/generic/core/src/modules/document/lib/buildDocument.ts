import { idModule, omitIdType } from '../../id';
import { documentType } from '../documentType';

export { buildDocument };

function buildDocument(
  documentFields: Omit<omitIdType<documentType>, 'status' | 'updateDate' | 'reviewStatus'>,
): documentType {
  return {
    ...documentFields,
    _id: idModule.lib.buildId(),
    reviewStatus: { hasBeenAmended: false, viewerNames: [] },
    status: 'free',
    updateDate: new Date().getTime(),
  };
}
