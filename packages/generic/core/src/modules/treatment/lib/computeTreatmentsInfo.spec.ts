import { annotationModule } from '../../../modules/annotation';
import { annotationsDiffModule } from '../../../modules/annotationsDiff';
import { treatmentGenerator } from '../generator';
import { computeTreatmentInfo } from './computeTreatmentsInfo';

describe('computeTreatmentInfo', () => {
  it('should compute the treatments info for a treatment', () => {
    // 'Spirou works at the Editions Dupuis with his cat';
    const previousAnnotations = [
      { start: 29, text: 'Dupuis', category: 'personnePhysiqueNom' },
      { start: 41, text: 'his cat', category: 'personnePhysiqueNom' },
    ].map(annotationModule.generator.generate);
    const nextAnnotations = [
      { start: 0, text: 'Spirou', category: 'personnePhysiqueNom' },
      { start: 20, text: 'Editions Dupuis', category: 'personneMorale' },
    ].map(annotationModule.generator.generate);
    const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(previousAnnotations, nextAnnotations);
    const treatment = treatmentGenerator.generate({ annotationsDiff });

    const treatmentInfo = computeTreatmentInfo(treatment);

    expect(treatmentInfo).toEqual({
      additionsCount: 1,
      deletionsCount: 1,
      modificationsCount: 0,
      resizedSmallerCount: 0,
      resizedBiggerCount: 1,
    });
  });
});
