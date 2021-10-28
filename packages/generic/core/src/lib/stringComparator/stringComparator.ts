import { computeLevenshteinDistance } from './computeLevenshteinDistance';
import { normalizeString } from './normalizeString';
import { compareNormalizedStrings } from './compareNormalizedStrings';

export { stringComparator };

export type { stringComparisonSensitivityType };

type stringComparisonSensitivityType =
  | { kind: 'levenshteinDistance'; threshold: number }
  | { kind: 'caseInsensitive' }
  | { kind: 'inclusion' };

const stringComparator = {
  insensitiveEqual(str1: string, str2: string): boolean {
    const normalizedStr1 = normalizeString(str1);
    const normalizedStr2 = normalizeString(str2);

    return normalizedStr1 === normalizedStr2;
  },

  normalizeString,
  compareNormalizedStrings,

  similar(str1: string, str2: string, threshold: number): boolean {
    const normalizedStr1 = normalizeString(str1);
    const normalizedStr2 = normalizeString(str2);

    const levenshteinDistance = computeLevenshteinDistance(normalizedStr1, normalizedStr2);

    if (Math.min(normalizedStr1.length, normalizedStr2.length) <= 4) {
      return levenshteinDistance <= 1;
    } else {
      return levenshteinDistance <= threshold;
    }
  },
};
