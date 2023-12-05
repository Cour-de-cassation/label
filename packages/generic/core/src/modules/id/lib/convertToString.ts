import { idType } from '../idType';

export { convertToString };

function convertToString(id: idType | string): string {
  return typeof id === 'string' ? id : id.toHexString();
}
