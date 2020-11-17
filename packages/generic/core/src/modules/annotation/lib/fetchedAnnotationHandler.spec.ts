import { annotationGenerator } from '../generator';
import { fetchedAnnotationHandler, LABEL_ANNOTATION_SOURCE } from './fetchedAnnotationHandler';
import { entityIdHandler } from './entityIdHandler';

describe('fetchedAnnotationHandler', () => {
  describe('createAll', () => {
    it('should create all the annotations for the given texts and indices', () => {
      const category = 'CATEGORY';
      const annotationText = 'engineer';
      const annotationTextsAndIndices = [
        { index: 34, text: annotationText },
        { index: 66, text: annotationText },
      ];

      const createdAnnotations = fetchedAnnotationHandler.createAll(category, annotationTextsAndIndices);

      expect(createdAnnotations).toEqual([
        {
          category,
          start: 34,
          entityId: entityIdHandler.compute(category, annotationText),
          _id: createdAnnotations[0] && createdAnnotations[0]._id,
          source: LABEL_ANNOTATION_SOURCE,
          text: annotationText,
        },
        {
          category,
          start: 66,
          entityId: entityIdHandler.compute(category, annotationText),
          _id: createdAnnotations[1] && createdAnnotations[1]._id,
          source: LABEL_ANNOTATION_SOURCE,
          text: annotationText,
        },
      ]);
    });
  });

  describe('updateManyCategory', () => {
    it('should update the category of all the given annotations of the given entityId', () => {
      const newCategory = 'ANOTHER_CATEGORY';
      const text = 'TEXT';
      const annotations = [
        { category: 'CATEGORY1', text },
        { category: 'CATEGORY2' },
        { category: 'CATEGORY1', text },
      ].map(generateFetchedAnnotation);

      const updatedAnnotations = fetchedAnnotationHandler.updateManyCategory(
        annotations,
        annotations[0].entityId,
        newCategory,
      );

      expect(updatedAnnotations.map((annotation) => annotation.category)).toEqual([
        newCategory,
        'CATEGORY2',
        newCategory,
      ]);
    });
  });

  describe('updateOneCategory', () => {
    it('should update the given annotation with the given category', () => {
      const newCategory = 'ANOTHER_CATEGORY';
      const annotations = [{ category: 'CATEGORY' }, { category: 'CATEGORY2' }].map(generateFetchedAnnotation);

      const updatedAnnotations = fetchedAnnotationHandler.updateOneCategory(
        annotations,
        annotations[0]._id,
        newCategory,
      );

      expect(updatedAnnotations[0].category).toEqual(newCategory);
    });
    it('should update the entityId if needed', () => {
      const newCategory = 'ANOTHER_CATEGORY';
      const text = 'TEXT';
      const annotations = [{ category: 'CATEGORY', text }, { category: 'CATEGORY2' }].map(generateFetchedAnnotation);

      const updatedAnnotations = fetchedAnnotationHandler.updateOneCategory(
        annotations,
        annotations[0]._id,
        newCategory,
      );

      expect(updatedAnnotations[0].entityId).toEqual(entityIdHandler.compute(newCategory, text));
    });
  });

  describe('getAnnotationIndex', () => {
    it('should return the index and the total of the annotation of a same entity', () => {
      const annotations = [
        { category: 'CATEGORY', start: 4, text: 'TEXT' },
        { category: 'CATEGORY', start: 17, text: 'TEXT' },
        { category: 'ANOTHER_CATEGORY', start: 8, text: 'ANOTHER_TEXT' },
        { category: 'CATEGORY', start: 1, text: 'TEXT' },
        { category: 'ANOTHER_CATEGORY', start: 23, text: 'ANOTHER_TEXT' },
      ].map(generateFetchedAnnotation);

      const annotationIndex = fetchedAnnotationHandler.getAnnotationIndex(annotations[0], annotations);

      expect(annotationIndex).toEqual({ index: 2, total: 3 });
    });
  });
});

function generateFetchedAnnotation(fields: { start?: number; category?: string; text?: string }) {
  return annotationGenerator.generate(fields);
}
