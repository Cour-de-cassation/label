import { annotationGenerator } from '../generator';
import { comparator } from './comparator';

describe('comparator', () => {
  describe('equal', () => {
    it('should return true for equal annotations', () => {
      const annotation = annotationGenerator.generate();

      const result = comparator.equal(annotation, annotation);

      expect(result).toEqual(true);
    });

    it('should return false otherwise', () => {
      const annotation1 = annotationGenerator.generate({ text: 'TEXT1' });
      const annotation2 = annotationGenerator.generate({ text: 'TEXT1' });

      const result = comparator.equal(annotation1, annotation2);

      expect(result).toEqual(false);
    });
  });

  describe('equalModuloCategory', () => {
    it('should return true if the annotations have the same text and start index', () => {
      const annotation1 = annotationGenerator.generate({ category: 'CATEGORY', text: 'TEXT', start: 0 });
      const annotation2 = annotationGenerator.generate({ category: 'ANOTHER_CATEGORY', text: 'TEXT', start: 0 });

      const result = comparator.equalModuloCategory(annotation1, annotation2);

      expect(result).toEqual(true);
    });

    it('should return false otherwise', () => {
      const annotation1 = annotationGenerator.generate({ category: 'CATEGORY', text: 'TEXT', start: 0 });
      const annotation2 = annotationGenerator.generate({
        category: 'ANOTHER_CATEGORY',
        text: 'ANOTHER_TEXT',
        start: 0,
      });

      const result = comparator.equalModuloCategory(annotation1, annotation2);

      expect(result).toEqual(false);
    });
  });
});
