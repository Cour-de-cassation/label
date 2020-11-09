import { annotationGenerator } from '../generator';
import { fetchedAnnotationHandler, LABEL_ANNOTATION_SOURCE } from './fetchedAnnotationHandler';
import { entityIdHandler } from './entityIdHandler';

describe('fetchedAnnotationHandler', () => {
  describe('createAll', () => {
    it('should create all the valid annotations for the given text and document', () => {
      const category = 'CATEGORY';
      const documentText =
        'engineering: Benoit is a software engineer. Nicolas is a software engineer. They are engineers.';
      const annotationText = 'engineer';
      const annotations = [
        generateFetchedAnnotation({
          category: 'FIRST_NAME',
          start: 13,
          text: 'Benoit',
        }),
        generateFetchedAnnotation({
          category: 'FIRST_NAME',
          start: 44,
          text: 'Nicolas',
        }),
      ];

      const createdAnnotations = fetchedAnnotationHandler.createAll(
        category,
        documentText,
        annotationText,
        annotations,
      );

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

    it('should not create an annotation if it is inside another annotation', () => {
      const category = 'LAST_NAME';
      const annotationText = 'Baker';
      const documentText = 'He lives at 221B, Baker street';
      const annotations = [
        generateFetchedAnnotation({
          category: 'ADRESS',
          start: 12,
          text: '221B, Baker street',
        }),
      ];

      const createdAnnotations = fetchedAnnotationHandler.createAll(
        category,
        documentText,
        annotationText,
        annotations,
      );

      expect(createdAnnotations).toEqual([]);
    });

    it('should not create an annotation if it overlaps another annotation at its beginning', () => {
      const category = 'ADRESS';
      const annotationText = 'Baker Street';
      const documentText = 'Josephine Baker Street';
      const annotations = [
        generateFetchedAnnotation({
          category: 'FULL_NAME',
          start: 0,
          text: 'Josephine Baker',
        }),
      ];

      const createdAnnotations = fetchedAnnotationHandler.createAll(
        category,
        documentText,
        annotationText,
        annotations,
      );

      expect(createdAnnotations).toEqual([]);
    });

    it('should not create an annotation if it overlaps another annotation at its end', () => {
      const category = 'FULL_NAME';
      const annotationText = 'Josephine Baker';
      const documentText = 'Josephine Baker Street';
      const annotations = [
        generateFetchedAnnotation({
          category: 'ADRESS',
          start: 10,
          text: 'Baker Street',
        }),
      ];

      const createdAnnotations = fetchedAnnotationHandler.createAll(
        category,
        documentText,
        annotationText,
        annotations,
      );

      expect(createdAnnotations).toEqual([]);
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
