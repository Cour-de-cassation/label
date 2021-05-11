import { annotationModule } from '../../annotation';
import { annotationsDiffModule } from '../../annotationsDiff';
import { treatmentGenerator } from '../generator';
import { computeTreatmentInfo } from './computeTreatmentInfo';

describe('computeTreatmentInfo', () => {
  it('should compute the treatments info for a treatment', () => {
    // 'Spirou works at the Editions Dupuis with his cat';
    const previousAnnotations = [
      { start: 29, text: 'Dupuis', category: 'personnePhysiqueNom' },
      { start: 41, text: 'his cat', category: 'personnePhysiqueNom' },
      { start: 90, text: 'Gaston', category: 'personnePhysiqueNom' },
    ].map(annotationModule.generator.generate);
    const nextAnnotations = [
      { start: 0, text: 'Spirou', category: 'personnePhysiqueNom' },
      { start: 20, text: 'Editions Dupuis', category: 'personneMorale' },
      { start: 90, text: 'Gaston', category: 'personnePhysiquePrenom' },
    ].map(annotationModule.generator.generate);
    const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(previousAnnotations, nextAnnotations);
    const treatment = treatmentGenerator.generate({ annotationsDiff });

    const treatmentInfo = computeTreatmentInfo(treatment);

    expect(treatmentInfo).toEqual({
      additionsCount: 1,
      deletionsCount: 1,
      modificationsCount: 1,
      resizedBiggerCount: 1,
      resizedSmallerCount: 0,
    });
  });

  it('should compute the treatments info for a treatment (addition case)', () => {
    const previousAnnotations = [].map(annotationModule.generator.generate);
    const nextAnnotations = [
      { start: 29, text: 'Gaston', category: 'personnePhysiqueNom' },
      { start: 40, text: 'Gaston', category: 'personnePhysiqueNom' },
      { start: 65, text: 'Lagaffe', category: 'personnePhysiqueNom' },
      { start: 90, text: 'Lagaffe', category: 'adresse' },
    ].map(annotationModule.generator.generate);
    const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(previousAnnotations, nextAnnotations);
    const treatment = treatmentGenerator.generate({ annotationsDiff });

    const treatmentInfo = computeTreatmentInfo(treatment);

    expect(treatmentInfo).toEqual({
      additionsCount: 3,
      deletionsCount: 0,
      modificationsCount: 0,
      resizedBiggerCount: 0,
      resizedSmallerCount: 0,
    });
  });

  it('should compute the treatments info for a treatment (deletion case)', () => {
    const previousAnnotations = [
      { start: 29, text: 'Gaston', category: 'personnePhysiqueNom' },
      { start: 40, text: 'Gaston', category: 'personnePhysiqueNom' },
      { start: 65, text: 'Lagaffe', category: 'personnePhysiqueNom' },
      { start: 90, text: 'Lagaffe', category: 'adresse' },
    ].map(annotationModule.generator.generate);
    const nextAnnotations = [].map(annotationModule.generator.generate);
    const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(previousAnnotations, nextAnnotations);
    const treatment = treatmentGenerator.generate({ annotationsDiff });

    const treatmentInfo = computeTreatmentInfo(treatment);

    expect(treatmentInfo).toEqual({
      additionsCount: 0,
      deletionsCount: 3,
      modificationsCount: 0,
      resizedBiggerCount: 0,
      resizedSmallerCount: 0,
    });
  });

  it('should compute the treatments info for a treatment (modification case)', () => {
    const previousAnnotations = [
      { start: 29, text: 'Gaston', category: 'personnePhysiqueNom' },
      { start: 40, text: 'Gaston', category: 'personnePhysiqueNom' },
      { start: 65, text: 'Lagaffe', category: 'personnePhysiqueNom' },
      { start: 90, text: 'Lagaffe', category: 'adresse' },
    ].map(annotationModule.generator.generate);
    const nextAnnotations = [
      { start: 29, text: 'Gaston', category: 'personnePhysiquePrenom' },
      { start: 40, text: 'Gaston', category: 'personnePhysiquePrenom' },
      { start: 65, text: 'Lagaffe', category: 'personnePhysiqueNom' },
      { start: 90, text: 'Lagaffe', category: 'personnePhysiqueNom' },
    ].map(annotationModule.generator.generate);
    const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(previousAnnotations, nextAnnotations);
    const treatment = treatmentGenerator.generate({ annotationsDiff });

    const treatmentInfo = computeTreatmentInfo(treatment);

    expect(treatmentInfo).toEqual({
      additionsCount: 0,
      deletionsCount: 0,
      modificationsCount: 2,
      resizedBiggerCount: 0,
      resizedSmallerCount: 0,
    });
  });

  it('should compute the treatments info for a treatment (resize bigger case)', () => {
    const previousAnnotations = [
      { start: 29, text: 'Gaston', category: 'personnePhysiqueNom' },
      { start: 60, text: 'Gaston', category: 'personnePhysiqueNom' },
      { start: 90, text: 'Harry', category: 'personnePhysiqueNom' },
    ].map(annotationModule.generator.generate);
    const nextAnnotations = [
      { start: 29, text: 'Gaston Lagaffe', category: 'personnePhysiquePrenom' },
      { start: 60, text: 'Gaston Lagaffe', category: 'personnePhysiquePrenom' },
      { start: 90, text: 'Harry Potter', category: 'personnePhysiqueNom' },
    ].map(annotationModule.generator.generate);
    const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(previousAnnotations, nextAnnotations);
    const treatment = treatmentGenerator.generate({ annotationsDiff });

    const treatmentInfo = computeTreatmentInfo(treatment);

    expect(treatmentInfo).toEqual({
      additionsCount: 0,
      deletionsCount: 0,
      modificationsCount: 0,
      resizedBiggerCount: 2,
      resizedSmallerCount: 0,
    });
  });

  it('should compute the treatments info for a treatment (resize smaller case)', () => {
    const previousAnnotations = [
      { start: 29, text: 'Gaston Lagaffe', category: 'personnePhysiquePrenom' },
      { start: 60, text: 'Gaston Lagaffe', category: 'personnePhysiquePrenom' },
      { start: 90, text: 'Harry Potter', category: 'personnePhysiqueNom' },
    ].map(annotationModule.generator.generate);
    const nextAnnotations = [
      { start: 29, text: 'Gaston', category: 'personnePhysiqueNom' },
      { start: 60, text: 'Gaston', category: 'personnePhysiqueNom' },
      { start: 90, text: 'Harry', category: 'personnePhysiqueNom' },
    ].map(annotationModule.generator.generate);
    const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(previousAnnotations, nextAnnotations);
    const treatment = treatmentGenerator.generate({ annotationsDiff });

    const treatmentInfo = computeTreatmentInfo(treatment);

    expect(treatmentInfo).toEqual({
      additionsCount: 0,
      deletionsCount: 0,
      modificationsCount: 0,
      resizedBiggerCount: 0,
      resizedSmallerCount: 2,
    });
  });
});
