import { idType } from '../idType';
import { areMongoIdEqual } from '../utils';

export { equalId };

function equalId(id1: idType, id2: idType): boolean {
  return areMongoIdEqual(id1, id2);
}
