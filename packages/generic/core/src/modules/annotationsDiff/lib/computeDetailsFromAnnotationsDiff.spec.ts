import { annotationModule } from '../../annotation';
import { buildAnnotationsDiff } from './buildAnnotationsDiff';
import { computeDetailsFromAnnotationsDiff } from './computeDetailsFromAnnotationsDiff';

describe('computeDetailsFromAnnotationsDiff', () => {
  const annotationsBefore = [
    { category: 'CATEGORY', text: 'TEXT', start: 10 },
    { category: 'ANOTHER_CATEGORY', text: 'ANOTHER_TEXT', start: 30 },
    { category: 'CATEGORY', text: 'LAP', start: 24 },
    { category: 'CATEGORY', text: 'TOO_BIG', start: 70 },
    { category: 'ANOTHER_CATEGORY', text: 'RESIZED', start: 100 },
  ].map(annotationModule.generator.generate);
  const annotationsAfter = [
    { category: 'CATEGORY', text: 'ANOTHER_TEXT', start: 30 },
    { category: 'CATEGORY', text: 'OVERLAP', start: 20 },
    { category: 'CATEGORY', text: 'NEW_TEXT', start: 0 },
    { category: 'CATEGORY', text: 'BIG', start: 74 },
    { category: 'CATEGORY', text: 'RESIZED_TEXT', start: 100 },
  ].map(annotationModule.generator.generate);
  const annotationsDiff = buildAnnotationsDiff(annotationsBefore, annotationsAfter);

  it('should compute the details of the annotations added in the diff', () => {
    const { addedAnnotations } = computeDetailsFromAnnotationsDiff(annotationsDiff);

    expect(addedAnnotations).toEqual([annotationsAfter[2]]);
  });

  it('should compute the details of the annotations deleted in the diff', () => {
    const { deletedAnnotations } = computeDetailsFromAnnotationsDiff(annotationsDiff);

    expect(deletedAnnotations).toEqual([annotationsBefore[0]]);
  });

  it('should compute the details of the annotations with a modified category in the diff', () => {
    const { categoryChangedAnnotations } = computeDetailsFromAnnotationsDiff(annotationsDiff);

    expect(categoryChangedAnnotations).toEqual([[annotationsBefore[1], annotationsAfter[0]]]);
  });

  it('should compute the details of the annotations resized bigger in the diff', () => {
    const { resizedBiggerAnnotations } = computeDetailsFromAnnotationsDiff(annotationsDiff);

    expect(resizedBiggerAnnotations).toEqual([
      [annotationsBefore[2], annotationsAfter[1]],
      [annotationsBefore[4], annotationsAfter[4]],
    ]);
  });

  it('should compute the details of the annotations resized smaller in the diff', () => {
    const { resizedSmallerAnnotations } = computeDetailsFromAnnotationsDiff(annotationsDiff);

    expect(resizedSmallerAnnotations).toEqual([[annotationsBefore[3], annotationsAfter[3]]]);
  });
});
