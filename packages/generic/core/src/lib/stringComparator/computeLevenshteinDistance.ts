import { range } from 'lodash';

export { computeLevenshteinDistance };

function computeLevenshteinDistance(str1: string, str2: string): number {
  const length1 = str1.length + 1;
  const length2 = str2.length + 1;

  const prefixLevenshteinDistance: number[][] = range(length1).map(() => range(length2).map(() => 0));

  range(1, length1).forEach((i) => (prefixLevenshteinDistance[i][0] = i));
  range(1, length2).forEach((j) => (prefixLevenshteinDistance[0][j] = j));

  range(1, length1).forEach((i) =>
    range(1, length2).forEach((j) => {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;

      prefixLevenshteinDistance[i][j] = Math.min(
        prefixLevenshteinDistance[i - 1][j] + 1,
        prefixLevenshteinDistance[i][j - 1] + 1,
        prefixLevenshteinDistance[i - 1][j - 1] + substitutionCost,
      );
    }),
  );

  return prefixLevenshteinDistance[length1 - 1][length2 - 1];
}
