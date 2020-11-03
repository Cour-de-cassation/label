import { idModule, omitIdType } from '../../id';
import { documentType } from '../documentType';

export { buildDocument };

const buildDocument: (
  documentFields: omitIdType<documentType>,
) => documentType = idModule.lib.buildObjectWithId;
