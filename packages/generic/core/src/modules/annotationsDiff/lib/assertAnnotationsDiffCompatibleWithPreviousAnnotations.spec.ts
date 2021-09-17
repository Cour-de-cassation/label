import { annotationModule } from '../../annotation';
import { annotationsDiffGenerator } from '../generator';
import { assertAnnotationsDiffCompatibleWithPreviousAnnotations } from './assertAnnotationsDiffCompatibleWithPreviousAnnotations';

describe('assertAnnotationsDiffCompatibleWithPreviousAnnotations', () => {
  it('should return true if no discrepancy is found', () => {
    const previousAnnotations = [
      { start: 0, text: 'TRUC' },
      { start: 20, text: 'MACHIN' },
    ].map(annotationModule.generator.generate);

    const annotationsDiff = annotationsDiffGenerator.generate({
      after: [annotationModule.generator.generate({ start: 10, text: 'BIDULE' })],
    });

    expect(assertAnnotationsDiffCompatibleWithPreviousAnnotations(previousAnnotations, annotationsDiff)).toBeTruthy();
  });

  it('should return true if there is a change in before array', () => {
    const previousAnnotations = [
      { start: 0, text: 'TRUC' },
      { start: 20, text: 'MACHIN' },
      { start: 30, text: 'BIDULE' },
    ].map(annotationModule.generator.generate);

    const annotationsDiff = annotationsDiffGenerator.generate({
      before: [previousAnnotations[1]],
      after: [annotationModule.generator.generate({ start: 19, text: ' MACHIN' })],
    });

    expect(assertAnnotationsDiffCompatibleWithPreviousAnnotations(previousAnnotations, annotationsDiff)).toBeTruthy();
  });

  it('should throw if a created annotation overlaps a previous one', () => {
    const previousAnnotations = [
      { start: 0, text: 'TRUC', category: 'nom' },
      { start: 20, text: 'MACHIN', category: 'nom' },
    ].map(annotationModule.generator.generate);
    const annotationsDiff = annotationsDiffGenerator.generate({
      after: [annotationModule.generator.generate({ start: 15, text: 'BIDULE', category: 'nom' })],
    });

    const functionCall = () =>
      assertAnnotationsDiffCompatibleWithPreviousAnnotations(previousAnnotations, annotationsDiff);

    expect(functionCall).toThrowError(
      Error(
        'annotations diff previousAnnotation (nom / MACHIN / 20) overlaps with afterAnnotation (nom / BIDULE / 15)',
      ),
    );
  });

  it('should throw if a bigger annotation overlaps a previous one', () => {
    const previousAnnotations = [
      { start: 0, text: 'TRUC', category: 'nom' },
      { start: 20, text: 'MACHIN', category: 'nom' },
      { start: 10, text: 'BIDULE', category: 'nom' },
    ].map(annotationModule.generator.generate);
    const annotationsDiff = {
      before: [annotationModule.generator.generate({ start: 10, text: 'BIDULE', category: 'nom' })],
      after: [annotationModule.generator.generate({ start: 10, text: 'BIDULE CHOSE', category: 'nom' })],
    };
    const functionCall = () =>
      assertAnnotationsDiffCompatibleWithPreviousAnnotations(previousAnnotations, annotationsDiff);

    expect(functionCall).toThrowError(
      Error(
        'annotations diff previousAnnotation (nom / MACHIN / 20) overlaps with afterAnnotation (nom / BIDULE CHOSE / 10)',
      ),
    );
  });
});
