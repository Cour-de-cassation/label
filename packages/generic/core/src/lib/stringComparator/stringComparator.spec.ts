import { stringComparator } from './stringComparator';

describe('stringComparator', () => {
  describe('insensitiveEqual', () => {
    it('should return true if the words are equal', () => {
      const str1 = 'lala';
      const str2 = 'lala';

      const result = stringComparator.insensitiveEqual(str1, str2);

      expect(result).toEqual(true);
    });

    it('should return true if the words are equal (case insensitive)', () => {
      const str1 = 'lala';
      const str2 = 'LALA';

      const result = stringComparator.insensitiveEqual(str1, str2);

      expect(result).toEqual(true);
    });

    it('should return true if the words are equal (case accent insensitive)', () => {
      const str1 = 'lala';
      const str2 = 'lâlà';

      const result = stringComparator.insensitiveEqual(str1, str2);

      expect(result).toEqual(true);
    });
  });
  describe('similar', () => {
    it('should return true if the words are similar (Levenshtein distance inferior than 2)', () => {
      const str1 = 'LALAL';
      const str2 = 'LOLOL';

      const result = stringComparator.similar(str1, str2, 2);

      expect(result).toEqual(true);
    });

    it('should return false if the words are not similar (Levenshtein distance superior than 2)', () => {
      const str1 = 'LALAL';
      const str2 = 'LOCOL';

      const result = stringComparator.similar(str1, str2, 2);

      expect(result).toEqual(false);
    });

    it('should return true if the words are similar with a custom threshold', () => {
      const str1 = 'LALAL';
      const str2 = 'GOGOL';

      const result = stringComparator.similar(str1, str2, 4);

      expect(result).toEqual(true);
    });

    it('should return false if the words are not similar with a custom threshold', () => {
      const str1 = 'LALAL';
      const str2 = 'GOGORL';

      const result = stringComparator.similar(str1, str2, 4);

      expect(result).toEqual(false);
    });

    it('should return true if the words are similar (Levenshtein distance inferior than 2) (case insensitive)', () => {
      const str1 = 'lalaL';
      const str2 = 'LOLOL';

      const result = stringComparator.similar(str1, str2, 2);

      expect(result).toEqual(true);
    });

    it('should return true if the words are similar (Levenshtein distance inferior than 2) (case accent insensitive)', () => {
      const str1 = 'Duponte';
      const str2 = 'Dûpond';

      const result = stringComparator.similar(str1, str2, 2);

      expect(result).toEqual(true);
    });
  });
});
