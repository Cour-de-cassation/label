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

      const annotations = fetchedAnnotationHandler.createAll(category, documentText, annotationText, []);

      expect(annotations).toEqual([
        {
          category,
          start: 34,
          entityId: entityIdHandler.compute(category, annotationText),
          _id: annotations[0]._id,
          source: LABEL_ANNOTATION_SOURCE,
          text: annotationText,
        },
        {
          category,
          start: 66,
          entityId: entityIdHandler.compute(category, annotationText),
          _id: annotations[1]._id,
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

    const createdAnnotations = fetchedAnnotationHandler.createAll(category, documentText, annotationText, annotations);

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

    const createdAnnotations = fetchedAnnotationHandler.createAll(category, documentText, annotationText, annotations);

    expect(createdAnnotations).toEqual([]);
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

function generateFetchedAnnotation(fields: { start: number; category: string; text: string }) {
  return annotationGenerator.generate(fields);
}
