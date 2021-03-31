import { documentType } from '../documentType';

export { countWords };

function countWords(document: documentType): number {
  return document.text.split(' ').length;
}
