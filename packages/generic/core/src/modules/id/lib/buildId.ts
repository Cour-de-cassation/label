import { idType } from '../idType';
import { buildMongoId } from '../utils';

export { buildId };

function buildId(id?: string | idType): idType {
  return buildMongoId(id);
}
