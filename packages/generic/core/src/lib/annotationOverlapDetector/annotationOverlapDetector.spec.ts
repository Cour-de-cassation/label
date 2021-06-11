import { annotationModule } from '../../modules/annotation';
import { annotationOverlapDetector } from './annotationOverlapDetector';

describe('annotationOverlapDetector', () => {
  describe('isAnnotationTextOverlappedWithAnyAnnotations', () => {
    it('should return true if the annotation is overlapped', () => {
      const annotations = [{ text: 'MACHIN', start: 10 }].map(annotationModule.generator.generate);
      const annotationStart = 13;
      const annotationText = 'TRUC';

      expect(
        annotationOverlapDetector.isAnnotationTextOverlappedWithAnyAnnotations(
          annotations,
          annotationStart,
          annotationText,
        ),
      ).toBeTruthy();
    });

    it('should return false if the annotation is not overlapped', () => {
      const annotations = [
        { text: 'MACHIN', start: 10 },
        { text: 'CHOSE', start: 30 },
      ].map(annotationModule.generator.generate);
      const annotationStart = 20;
      const annotationText = 'TRUC';

      expect(
        annotationOverlapDetector.isAnnotationTextOverlappedWithAnyAnnotations(
          annotations,
          annotationStart,
          annotationText,
        ),
      ).toBeFalsy();
    });
  });

  describe('findOverlappingAnnotation', () => {
    it('should return the overlapping annotation if relevant', () => {
      const annotations = [{ text: 'MACHIN', start: 10 }].map(annotationModule.generator.generate);
      const annotationStart = 13;
      const annotationText = 'TRUC';

      expect(annotationOverlapDetector.findOverlappingAnnotation(annotations, annotationStart, annotationText)).toEqual(
        annotations[0],
      );
    });

    it('should return undefined if not relevant', () => {
      const annotations = [
        { text: 'MACHIN', start: 10 },
        { text: 'CHOSE', start: 30 },
      ].map(annotationModule.generator.generate);
      const annotationStart = 20;
      const annotationText = 'TRUC';

      expect(annotationOverlapDetector.findOverlappingAnnotation(annotations, annotationStart, annotationText)).toEqual(
        undefined,
      );
    });
  });
});
