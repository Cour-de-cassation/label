import { annotationModule } from '../../annotation';
import { annotationsDiffGenerator } from '../generator';
import { areAnnotationsDiffCompatibleWithAnnotations } from './areAnnotationsDiffCompatibleWithAnnotations';

describe('areAnnotationsDiffCompatibleWithAnnotations', () => {
  it('should return true if no discrepancy is found', () => {
    const previousAnnotations = [
      { start: 0, text: 'TRUC' },
      { start: 20, text: 'MACHIN' },
    ].map(annotationModule.generator.generate);

    const annotationsDiff = annotationsDiffGenerator.generate({
      after: [annotationModule.generator.generate({ start: 10, text: 'BIDULE' })],
    });

    expect(areAnnotationsDiffCompatibleWithAnnotations(previousAnnotations, annotationsDiff)).toBeTruthy();
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

    expect(areAnnotationsDiffCompatibleWithAnnotations(previousAnnotations, annotationsDiff)).toBeTruthy();
  });

  it('should return false if a created annotation overlaps a previous one', () => {
    const previousAnnotations = [
      { start: 0, text: 'TRUC' },
      { start: 20, text: 'MACHIN' },
    ].map(annotationModule.generator.generate);
    const annotationsDiff = annotationsDiffGenerator.generate({
      after: [annotationModule.generator.generate({ start: 15, text: 'BIDULE' })],
    });

    expect(areAnnotationsDiffCompatibleWithAnnotations(previousAnnotations, annotationsDiff)).toBeFalsy();
  });

  it('should return false if a bigger annotation overlaps a previous one', () => {
    const previousAnnotations = [
      { start: 0, text: 'TRUC' },
      { start: 20, text: 'MACHIN' },
    ].map(annotationModule.generator.generate);
    const annotationsDiff = {
      before: [annotationModule.generator.generate({ start: 10, text: 'BIDULE' })],
      after: [annotationModule.generator.generate({ start: 10, text: 'BIDULE CHOSE' })],
    };

    expect(areAnnotationsDiffCompatibleWithAnnotations(previousAnnotations, annotationsDiff)).toBeFalsy();
  });
});
