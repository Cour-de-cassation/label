import { annotationModule } from '../../annotation';
import { annotationsDiffGenerator } from '../generator';
import { assertAnnotationsDiffAutoConsistent } from './assertAnnotationsDiffAutoConsistent';

describe('assertAnnotationsDiffAutoConsistent', () => {
  it('should return true if no discrepancy is found', () => {
    const beforeAnnotations = [
      { start: 0, text: 'TRUC' },
      { start: 20, text: 'MACHIN' },
    ].map((fields) => annotationModule.generator.generate({ ...fields, category: 'nom' }));
    const afterAnnotations = [annotationModule.generator.generate({ start: 10, text: 'BIDULE' })];

    const annotationsDiff = annotationsDiffGenerator.generate({
      before: beforeAnnotations,
      after: afterAnnotations,
    });

    expect(assertAnnotationsDiffAutoConsistent(annotationsDiff)).toBeTruthy();
  });

  it('should return true if there is a change in before array', () => {
    const beforeAnnotations = [
      { start: 0, text: 'TRUC' },
      { start: 20, text: 'MACHIN' },
      { start: 30, text: 'BIDULE' },
    ].map((fields) => annotationModule.generator.generate({ ...fields, category: 'nom' }));
    const afterAnnotations = [annotationModule.generator.generate({ start: 40, text: ' MACHIN' })];

    const annotationsDiff = annotationsDiffGenerator.generate({
      before: [beforeAnnotations[1]],
      after: afterAnnotations,
    });

    expect(assertAnnotationsDiffAutoConsistent(annotationsDiff)).toBeTruthy();
  });

  it('should return throw if there is an total overlap in the after array', () => {
    const afterAnnotations = [
      { start: 0, text: 'TRUC' },
      { start: 20, text: 'MACHIN' },
      { start: 30, text: 'BIDULE' },
      { start: 27, text: 'LE BIDULE' },
    ].map((fields) => annotationModule.generator.generate({ ...fields, category: 'nom' }));
    const annotationsDiff = annotationsDiffGenerator.generate({
      after: afterAnnotations,
    });

    const functionCall = () => assertAnnotationsDiffAutoConsistent(annotationsDiff);

    expect(functionCall).toThrow(Error('annotations (nom / LE BIDULE / 27) and (nom / BIDULE / 30) overlap.'));
  });

  it('should return throw if there is a partial left overlap in the after array', () => {
    const afterAnnotations = [
      { start: 0, text: 'TRUC' },
      { start: 20, text: 'MACHIN' },
      { start: 30, text: 'BIDULE' },
      { start: 30, text: 'BID' },
    ].map((fields) => annotationModule.generator.generate({ ...fields, category: 'nom' }));

    const annotationsDiff = annotationsDiffGenerator.generate({
      after: afterAnnotations,
    });

    const functionCall = () => assertAnnotationsDiffAutoConsistent(annotationsDiff);

    expect(functionCall).toThrow(Error('annotations (nom / BIDULE / 30) and (nom / BID / 30) overlap.'));
  });

  it('should return throw if there is a partial right overlap in the after array', () => {
    const afterAnnotations = [
      { start: 0, text: 'TRUC' },
      { start: 20, text: 'MACHIN' },
      { start: 30, text: 'BIDULE' },
      { start: 33, text: 'ULE' },
    ].map((fields) => annotationModule.generator.generate({ ...fields, category: 'nom' }));

    const annotationsDiff = annotationsDiffGenerator.generate({
      after: afterAnnotations,
    });

    const functionCall = () => assertAnnotationsDiffAutoConsistent(annotationsDiff);

    expect(functionCall).toThrow(Error('annotations (nom / BIDULE / 30) and (nom / ULE / 33) overlap.'));
  });
});
