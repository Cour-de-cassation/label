import { annotationModule } from '../../annotation';
import { treatmentGenerator } from '../generator';
import { areAnnotationsConsistent } from './areAnnotationsConsistent';

describe('checkAnnotationsConsistency', () => {
  it('should return true if no discrepancy is found', () => {
    const previousAnnotations = [
      { start: 0, text: 'TRUC' },
      { start: 20, text: 'MACHIN' },
    ].map(annotationModule.generator.generate);
    const nextAnnotations = [annotationModule.generator.generate({ start: 10, text: 'BIDULE' })];
    const previousTreatments = [
      treatmentGenerator.generate({ annotationsDiff: { before: [], after: previousAnnotations } }),
    ];
    const treatment = treatmentGenerator.generate({ annotationsDiff: { before: [], after: nextAnnotations } });

    expect(areAnnotationsConsistent(previousTreatments, treatment)).toBeTruthy();
  });

  it('should return false if a created annotation overlaps a previous one', () => {
    const previousAnnotations = [
      { start: 0, text: 'TRUC' },
      { start: 20, text: 'MACHIN' },
    ].map(annotationModule.generator.generate);
    const nextAnnotations = [annotationModule.generator.generate({ start: 15, text: 'BIDULE' })];
    const previousTreatments = [
      treatmentGenerator.generate({ annotationsDiff: { before: [], after: previousAnnotations } }),
    ];
    const treatment = treatmentGenerator.generate({ annotationsDiff: { before: [], after: nextAnnotations } });

    expect(areAnnotationsConsistent(previousTreatments, treatment)).toBeFalsy();
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
    const previousTreatments = [
      treatmentGenerator.generate({ annotationsDiff: { before: [], after: previousAnnotations } }),
    ];
    const treatment = treatmentGenerator.generate({ annotationsDiff });

    expect(areAnnotationsConsistent(previousTreatments, treatment)).toBeFalsy();
  });
});
