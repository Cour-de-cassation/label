import { annotationModule } from '../../modules';
import { annotationHandler } from './annotationHandler';

describe('annotationHandler', () => {
  describe('createAll', () => {
    it('should create all the annotations for the given texts and indices', () => {
      const category = 'CATEGORY';
      const annotationText = 'engineer';
      const annotationTextsAndIndices = [
        { index: 34, text: annotationText },
        { index: 66, text: annotationText },
      ];
      const annotations = [{}].map(generateFetchedAnnotation);

      const newAnnotations = annotationHandler.createAll(annotations, category, annotationTextsAndIndices);

      expect(newAnnotations).toEqual([
        {
          category,
          start: 34,
          entityId: annotationModule.lib.entityIdHandler.compute(category, annotationText),
          text: annotationText,
        },
        {
          category,
          start: 66,
          entityId: annotationModule.lib.entityIdHandler.compute(category, annotationText),
          text: annotationText,
        },
        ...annotations,
      ]);
    });
  });

  describe('deleteByTextAndStart', () => {
    it('should delete an annotation according to its text and start position', () => {
      const annotation1 = annotationModule.generator.generate({ category: 'CATEGORY', text: 'FIRST_TEXT' });
      const annotation2 = annotationModule.generator.generate({ category: 'CATEGORY', text: 'SECOND_TEXT' });
      const annotations = [annotation1, annotation2];

      const newAnnotations = annotationHandler.deleteByTextAndStart(annotations, annotation2);

      expect(newAnnotations).toEqual([annotation1]);
    });

    it('should not conserve a link of a deleted annotation', () => {
      const annotation1 = annotationModule.generator.generate({ category: 'CATEGORY', text: 'FIRST_TEXT' });
      const annotation2 = annotationModule.generator.generate({ category: 'CATEGORY', text: 'SECOND_TEXT' });
      const annotation1Linked = annotationModule.lib.annotationLinker.link(annotation1, annotation2);
      const annotations = [annotation1Linked, annotation2];

      const newAnnotations = annotationHandler.create(
        annotationHandler.deleteByTextAndStart(annotations, annotation2),
        annotation2,
      );

      expect(annotationModule.lib.sortAnnotations(newAnnotations)).toEqual(
        annotationModule.lib.sortAnnotations([annotation1, annotation2]),
      );
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

      const updatedAnnotations = annotationHandler.updateManyCategory(
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

      const updatedAnnotations = annotationHandler.updateOneCategory(
        annotations,
        annotations[0].text,
        annotations[0].start,
        newCategory,
      );

      expect(updatedAnnotations[0].category).toEqual(newCategory);
    });
    it('should update the entityId if needed', () => {
      const newCategory = 'ANOTHER_CATEGORY';
      const text = 'TEXT';
      const annotations = [{ category: 'CATEGORY', text }, { category: 'CATEGORY2' }].map(generateFetchedAnnotation);

      const updatedAnnotations = annotationHandler.updateOneCategory(
        annotations,
        annotations[0].text,
        annotations[0].start,
        newCategory,
      );

      expect(updatedAnnotations[0].entityId).toEqual(annotationModule.lib.entityIdHandler.compute(newCategory, text));
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

      const annotationIndex = annotationHandler.getAnnotationIndex(annotations, annotations[0]);

      expect(annotationIndex).toEqual({ index: 2, total: 3 });
    });
  });
});

function generateFetchedAnnotation(fields: { start?: number; category?: string; text?: string }) {
  return annotationModule.generator.generate(fields);
}
