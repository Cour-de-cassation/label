import { annotationModule } from '../../../modules/annotation';
import { annotationsDiffGenerator } from '../generator';
import { areAnnotationsDiffAutoConsistent } from './areAnnotationsDiffAutoConsistent';

describe('areAnnotationsDiffAutoConsistent', () => {
  it('should return true if no discrepancy is found', () => {
    const beforeAnnotations = [
      { start: 0, text: 'TRUC' },
      { start: 20, text: 'MACHIN' },
    ].map(annotationModule.generator.generate);
    const afterAnnotations = [annotationModule.generator.generate({ start: 10, text: 'BIDULE' })];

    const annotationsDiff = annotationsDiffGenerator.generate({
      before: beforeAnnotations,
      after: afterAnnotations,
    });

    expect(areAnnotationsDiffAutoConsistent(annotationsDiff)).toBeTruthy();
  });

  it('should return true if there is a change in before array', () => {
    const beforeAnnotations = [
      { start: 0, text: 'TRUC' },
      { start: 20, text: 'MACHIN' },
      { start: 30, text: 'BIDULE' },
    ].map(annotationModule.generator.generate);
    const afterAnnotations = [annotationModule.generator.generate({ start: 40, text: ' MACHIN' })];

    const annotationsDiff = annotationsDiffGenerator.generate({
      before: [beforeAnnotations[1]],
      after: afterAnnotations,
    });

    expect(areAnnotationsDiffAutoConsistent(annotationsDiff)).toBeTruthy();
  });

  it('should return false if there is an total overlap in the after array', () => {
    const afterAnnotations = [
      { start: 0, text: 'TRUC' },
      { start: 20, text: 'MACHIN' },
      { start: 30, text: 'BIDULE' },
      { start: 27, text: 'LE BIDULE' },
    ].map(annotationModule.generator.generate);

    const annotationsDiff = annotationsDiffGenerator.generate({
      after: afterAnnotations,
    });

    expect(areAnnotationsDiffAutoConsistent(annotationsDiff)).toBeFalsy();
  });

  it('should return false if there is a partial left overlap in the after array', () => {
    const afterAnnotations = [
      { start: 0, text: 'TRUC' },
      { start: 20, text: 'MACHIN' },
      { start: 30, text: 'BIDULE' },
      { start: 30, text: 'BID' },
    ].map(annotationModule.generator.generate);

    const annotationsDiff = annotationsDiffGenerator.generate({
      after: afterAnnotations,
    });

    expect(areAnnotationsDiffAutoConsistent(annotationsDiff)).toBeFalsy();
  });

  it('should return false if there is a partial right overlap in the after array', () => {
    const afterAnnotations = [
      { start: 0, text: 'TRUC' },
      { start: 20, text: 'MACHIN' },
      { start: 30, text: 'BIDULE' },
      { start: 33, text: 'ULE' },
    ].map(annotationModule.generator.generate);

    const annotationsDiff = annotationsDiffGenerator.generate({
      after: afterAnnotations,
    });

    expect(areAnnotationsDiffAutoConsistent(annotationsDiff)).toBeFalsy();
  });
});
