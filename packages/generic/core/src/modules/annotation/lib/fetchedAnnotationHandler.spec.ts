import { idModule } from '../../id';
import { annotationGenerator } from '../generator';
import {
  fetchedAnnotationHandler,
  LABEL_ANNOTATION_SOURCE,
} from './fetchedAnnotationHandler';
import { entityIdHandler } from './entityIdHandler';

describe('fetchedAnnotationHandler', () => {
  describe('createAll', () => {
    it('should create all the valid annotations for the given text and document', () => {
      const category = 'CATEGORY';
      const documentId = idModule.lib.buildId();
      const documentText =
        'engineering: Benoit is a software engineer. Nicolas is a software engineer. They are engineers.';
      const annotationText = 'engineer';

      const annotations = fetchedAnnotationHandler.createAll(
        category,
        documentId,
        documentText,
        annotationText,
      );

      expect(annotations).toEqual([
        {
          category,
          start: 34,
          documentId,
          entityId: entityIdHandler.compute(category, annotationText),
          _id: annotations[0]._id,
          source: LABEL_ANNOTATION_SOURCE,
          text: annotationText,
        },
        {
          category,
          start: 66,
          documentId,
          entityId: entityIdHandler.compute(category, annotationText),
          _id: annotations[1]._id,
          source: LABEL_ANNOTATION_SOURCE,
          text: annotationText,
        },
      ]);
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

      const annotationIndex = fetchedAnnotationHandler.getAnnotationIndex(
        annotations[0],
        annotations,
      );

      expect(annotationIndex).toEqual({ index: 2, total: 3 });
    });
  });
});

function generateFetchedAnnotation(fields: { start: number }) {
  return annotationGenerator.generate(fields);
}
