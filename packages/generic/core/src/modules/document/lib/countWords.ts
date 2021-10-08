import { documentType } from '../documentType';

export { countWords };

function countWords({ text }: { text: documentType['text'] }): number {
  return text.split(' ').filter(Boolean).length;
}
