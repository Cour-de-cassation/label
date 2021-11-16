import { annotationModule, annotationType } from '../../modules/annotation';
import { annotationTextDetector } from './annotationTextDetector';

describe('annotationTextDetector', () => {
  describe('detectAnnotationTextsAndIndices', () => {
    it('should return all the annotation text and indices for the given text and document', () => {
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

      const annotationTextsAndIndices = annotationTextDetector.detectAnnotationTextsAndIndices({
        documentText,
        annotationText,
        annotations,
      });

      expect(annotationTextsAndIndices).toEqual([
        {
          index: 34,
          text: annotationText,
        },
        {
          index: 66,
          text: annotationText,
        },
      ]);
    });

    it('should return all the annotation text and indices for the given text and document, including different cases and accents', () => {
      const documentText = 'M. ELEVES, Mrs Élevès and Sir elevès';
      const annotationText = 'ELEVES';

      const annotationTextsAndIndices = annotationTextDetector.detectAnnotationTextsAndIndices({
        documentText,
        annotationText,
        annotations: [],
      });

      expect(annotationTextsAndIndices).toEqual([
        {
          index: 3,
          text: 'ELEVES',
        },
        {
          index: 15,
          text: 'Élevès',
        },
        {
          index: 30,
          text: 'elevès',
        },
      ]);
    });

    it('should not return any text and index if it is inside another annotation', () => {
      const annotationText = 'Baker';
      const documentText = 'He lives at 221B, Baker street';
      const annotations = [
        generateFetchedAnnotation({
          category: 'ADRESS',
          start: 12,
          text: '221B, Baker street',
        }),
      ];

      const annotationTextsAndIndices = annotationTextDetector.detectAnnotationTextsAndIndices({
        documentText,
        annotationText,
        annotations,
      });

      expect(annotationTextsAndIndices).toEqual([]);
    });

    it('should not return any text and index if it overlaps another annotation at its beginning', () => {
      const annotationText = 'Baker Street';
      const documentText = 'Josephine Baker Street';
      const annotations = [
        generateFetchedAnnotation({
          category: 'FULL_NAME',
          start: 0,
          text: 'Josephine Baker',
        }),
      ];

      const annotationTextsAndIndices = annotationTextDetector.detectAnnotationTextsAndIndices({
        documentText,
        annotationText,
        annotations,
      });

      expect(annotationTextsAndIndices).toEqual([]);
    });

    it('should not return any text and index if it overlaps another annotation at its end', () => {
      const annotationText = 'Josephine Baker';
      const documentText = 'Josephine Baker Street';
      const annotations = [
        generateFetchedAnnotation({
          category: 'ADRESS',
          start: 10,
          text: 'Baker Street',
        }),
      ];

      const annotationTextsAndIndices = annotationTextDetector.detectAnnotationTextsAndIndices({
        documentText,
        annotationText,
        annotations,
      });

      expect(annotationTextsAndIndices).toEqual([]);
    });

    it('should not return text and indices of occurences inside another word', () => {
      const documentText = 'engineering. engineering is difficult';
      const annotationText = 'engineer';
      const annotations = [] as annotationType[];

      const annotationTextsAndIndices = annotationTextDetector.detectAnnotationTextsAndIndices({
        documentText,
        annotationText,
        annotations,
      });

      expect(annotationTextsAndIndices).toEqual([]);
    });

    it('should return text and indices when initials', () => {
      const documentText = 'B.SERRANO and B.GLE';
      const annotationText = 'B.';
      const annotations = [] as annotationType[];

      const annotationTextsAndIndices = annotationTextDetector.detectAnnotationTextsAndIndices({
        documentText,
        annotationText,
        annotations,
      });

      expect(annotationTextsAndIndices).toEqual([
        { index: 0, text: annotationText },
        { index: 14, text: annotationText },
      ]);
    });
  });
});

function generateFetchedAnnotation(fields: { start?: number; category?: string; text?: string }) {
  return annotationModule.generator.generate(fields);
}
