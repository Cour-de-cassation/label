import { annotationGenerator } from '../generator';
import { removeOverlappingAnnotations } from './removeOverlappingAnnotations';

describe('removeOverlappingAnnotations', () => {
  it('should return annotations without overlaping ones', () => {
    const annotations = [
      { text: 'TEST', start: 1 },
      { text: 'TRUC MACHIN', start: 10 },
      { text: 'MACHIN', start: 15 },
    ].map(annotationGenerator.generate);

    const result = removeOverlappingAnnotations(annotations);

    expect(result).toEqual([annotations[0], annotations[1]]);
  });

  it('should return all annotations because there is no overlapping', () => {
    const annotations = [
      { text: 'TEST', start: 1 },
      { text: 'TRUC', start: 10 },
      { text: 'MACHIN', start: 15 },
    ].map(annotationGenerator.generate);

    const result = removeOverlappingAnnotations(annotations);

    expect(result).toEqual(annotations);
  });

  it('should return annotations without overlaping ones and keeping longest text annotation', () => {
    const annotations = [
      { text: 'TEST', start: 1 },
      { text: 'TRUC MACHIN', start: 10 },
      { text: 'MACHIN CHOSE BIDULE', start: 15 },
    ].map(annotationGenerator.generate);

    const result = removeOverlappingAnnotations(annotations);

    expect(result).toEqual([annotations[0], annotations[2]]);
  });
});
