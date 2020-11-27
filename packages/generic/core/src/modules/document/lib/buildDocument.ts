import { idModule, omitIdType } from '../../id';
import { documentType } from '../documentType';

export { buildDocument };

function buildDocument(documentFields: Omit<omitIdType<documentType>, 'locked'>): documentType {
  return {
    ...documentFields,
    _id: idModule.lib.buildId(),
    locked: false,
  };
}
