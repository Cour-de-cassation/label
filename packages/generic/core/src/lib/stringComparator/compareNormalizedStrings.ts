import { normalizeString } from './normalizeString';

export { compareNormalizedStrings };

function compareNormalizedStrings(text1: string, text2: string) {
  return normalizeString(text1) === normalizeString(text2);
}
