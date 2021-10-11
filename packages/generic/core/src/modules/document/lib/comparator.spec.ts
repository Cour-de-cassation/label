import { documentGenerator } from '../generator';
import { comparator } from './comparator';

describe('comparator', () => {
  describe('compareByPriority', () => {
    it('low should be equal to low', () => {
      const document1 = documentGenerator.generate({ priority: 0 });
      const document2 = documentGenerator.generate({ priority: 0 });

      const result = comparator.compareByPriority(document1, document2);

      expect(result).toEqual(0);
    });

    it('low should be greater than medium', () => {
      const document1 = documentGenerator.generate({ priority: 0 });
      const document2 = documentGenerator.generate({ priority: 2 });

      const result = comparator.compareByPriority(document1, document2);

      expect(result).toBeGreaterThanOrEqual(1);
    });

    it('low should be greater than high', () => {
      const document1 = documentGenerator.generate({ priority: 0 });
      const document2 = documentGenerator.generate({ priority: 4 });

      const result = comparator.compareByPriority(document1, document2);

      expect(result).toBeGreaterThanOrEqual(1);
    });

    it('medium should be less than low', () => {
      const document1 = documentGenerator.generate({ priority: 2 });
      const document2 = documentGenerator.generate({ priority: 0 });

      const result = comparator.compareByPriority(document1, document2);

      expect(result).toBeLessThanOrEqual(-1);
    });

    it('medium should be equal to medium', () => {
      const document1 = documentGenerator.generate({ priority: 2 });
      const document2 = documentGenerator.generate({ priority: 2 });

      const result = comparator.compareByPriority(document1, document2);

      expect(result).toEqual(0);
    });

    it('medium should be greater than high', () => {
      const document1 = documentGenerator.generate({ priority: 2 });
      const document2 = documentGenerator.generate({ priority: 4 });

      const result = comparator.compareByPriority(document1, document2);

      expect(result).toBeGreaterThanOrEqual(1);
    });

    it('high should be less than low', () => {
      const document1 = documentGenerator.generate({ priority: 4 });
      const document2 = documentGenerator.generate({ priority: 0 });

      const result = comparator.compareByPriority(document1, document2);

      expect(result).toBeLessThanOrEqual(-1);
    });

    it('high should be less than medium', () => {
      const document1 = documentGenerator.generate({ priority: 4 });
      const document2 = documentGenerator.generate({ priority: 2 });

      const result = comparator.compareByPriority(document1, document2);

      expect(result).toBeLessThanOrEqual(-1);
    });

    it('high should be equal to high', () => {
      const document1 = documentGenerator.generate({ priority: 4 });
      const document2 = documentGenerator.generate({ priority: 4 });

      const result = comparator.compareByPriority(document1, document2);

      expect(result).toEqual(0);
    });
  });
});
