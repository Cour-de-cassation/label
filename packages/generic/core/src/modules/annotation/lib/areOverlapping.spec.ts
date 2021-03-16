import { annotationGenerator } from '../generator';
import { areOverlapping } from './areOverlapping';

describe('areOverlapping', () => {
  it('should return true if the given annotations are overlapping', () => {
    const annotations = [
      { text: 'MACHIN TRUC', start: 10 },
      { text: 'TRUC', start: 17 },
    ].map(annotationGenerator.generate);

    const result = areOverlapping(annotations[0], annotations[1]);

    expect(result).toEqual(true);
  });

  it('should return false if the given annotations are not overlapping', () => {
    const annotations = [
      { text: 'MACHIN TRUC', start: 10 },
      { text: 'TRUC', start: 27 },
    ].map(annotationGenerator.generate);

    const result = areOverlapping(annotations[0], annotations[1]);

    expect(result).toEqual(false);
  });
});
