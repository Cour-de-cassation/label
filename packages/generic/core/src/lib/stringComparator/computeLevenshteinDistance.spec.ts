import { computeLevenshteinDistance } from './computeLevenshteinDistance';

describe('computeLevenshteinDistance', () => {
  it('should link the annotations of a same category with only different case (case 1)', () => {
    const str1 = 'LALA';
    const str2 = 'LOLO';

    const levenshteinDistance = computeLevenshteinDistance(str1, str2);

    expect(levenshteinDistance).toEqual(2);
  });
  it('should link the annotations of a same category with only different case (case 2)', () => {
    const str1 = 'Dupont';
    const str2 = 'Dupond';

    const levenshteinDistance = computeLevenshteinDistance(str1, str2);

    expect(levenshteinDistance).toEqual(1);
  });
  it('should link the annotations of a same category with only different case (case 3)', () => {
    const str1 = 'NICHE';
    const str2 = 'CHIENS';

    const levenshteinDistance = computeLevenshteinDistance(str1, str2);

    expect(levenshteinDistance).toEqual(5);
  });
});
