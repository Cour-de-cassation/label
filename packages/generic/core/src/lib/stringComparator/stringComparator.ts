import { computeLevenshteinDistance } from './computeLevenshteinDistance';

export { stringComparator };

const stringComparator = {
  insensitiveEqual(str1: string, str2: string): boolean {
    const normalizedStr1 = normalizeString(str1);
    const normalizedStr2 = normalizeString(str2);

    return normalizedStr1 === normalizedStr2;
  },

  normalizeString,

  similar(str1: string, str2: string, threshold: number | undefined = 2): boolean {
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

function normalizeString(str: string) {
  return str
    .toLowerCase()
    .replace(/é/gi, 'e')
    .replace(/è/gi, 'e')
    .replace(/ê/gi, 'e')
    .replace(/ë/gi, 'e')
    .replace(/à/gi, 'a')
    .replace(/â/gi, 'a')
    .replace(/ù/gi, 'u')
    .replace(/û/gi, 'u')
    .replace(/ü/gi, 'u')
    .replace(/î/gi, 'i')
    .replace(/ï/gi, 'i')
    .replace(/ç/gi, 'c');
}
