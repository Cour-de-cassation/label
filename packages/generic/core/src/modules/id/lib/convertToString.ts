import { idType } from '../idType';

export { convertToString };

function convertToString(id: idType): string {
  return id.toHexString();
}
