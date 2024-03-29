import { annotationModule } from '../../annotation';
import { annotationsDiffModule } from '../../annotationsDiff';
import { settingsModule } from '../../settings';
import { computeTreatmentInfo } from './computeTreatmentInfo';

describe('computeTreatmentInfo', () => {
  const settings = settingsModule.lib.buildSettings({
    personnePhysiqueNom: { isSensitive: true, isAnonymized: true },
    personnePhysiquePrenom: { isSensitive: false, isAnonymized: true },
    personneMorale: { isSensitive: false, isAnonymized: false },
    adresse: { isSensitive: false, isAnonymized: true },
  });
  it('should compute the treatments info for a treatment', () => {
    // 'Spirou works at the Editions Dupuis with his cat';
    const previousAnnotations = [
      { start: 29, text: 'Dupuis', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 41, text: 'his cat', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 90, text: 'Gaston', category: 'personnePhysiqueNom', certaintyScore: 1 },
    ].map(annotationModule.lib.buildAnnotation);
    const nextAnnotations = [
      { start: 0, text: 'Spirou', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 20, text: 'Editions Dupuis', category: 'personneMorale', certaintyScore: 1 },
      { start: 90, text: 'Gaston', category: 'personnePhysiquePrenom', certaintyScore: 1 },
    ].map(annotationModule.lib.buildAnnotation);
    const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(previousAnnotations, nextAnnotations);

    const treatmentInfo = computeTreatmentInfo(annotationsDiff, settings);

    expect(treatmentInfo).toEqual({
      surAnnotationsCount: 2,
      subAnnotationsSensitiveCount: 1,
      subAnnotationsNonSensitiveCount: 0,
    });
  });

  it('should compute the treatments info for a treatment (addition case)', () => {
    const previousAnnotations = [].map(annotationModule.lib.buildAnnotation);
    const nextAnnotations = [
      { start: 29, text: 'Gaston', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 40, text: 'Pierre', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 65, text: 'Lagaffe', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 90, text: 'Lagaffe', category: 'adresse', certaintyScore: 1 },
    ].map(annotationModule.lib.buildAnnotation);
    const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(previousAnnotations, nextAnnotations);

    const treatmentInfo = computeTreatmentInfo(annotationsDiff, settings);

    expect(treatmentInfo).toEqual({
      surAnnotationsCount: 0,
      subAnnotationsSensitiveCount: 3,
      subAnnotationsNonSensitiveCount: 1,
    });
  });

  it('should compute the treatments info for a treatment (deletion case)', () => {
    const previousAnnotations = [
      { start: 29, text: 'Gaston', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 40, text: 'Pierre', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 65, text: 'Lagaffe', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 90, text: 'Lagaffe', category: 'personneMorale', certaintyScore: 1 },
    ].map(annotationModule.lib.buildAnnotation);
    const nextAnnotations = [].map(annotationModule.lib.buildAnnotation);
    const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(previousAnnotations, nextAnnotations);

    const treatmentInfo = computeTreatmentInfo(annotationsDiff, settings);

    expect(treatmentInfo).toEqual({
      surAnnotationsCount: 3,
      subAnnotationsSensitiveCount: 0,
      subAnnotationsNonSensitiveCount: 0,
    });
  });

  it('should compute the treatments info for a treatment (modification case)', () => {
    const previousAnnotations = [
      { start: 29, text: 'Gaston', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 40, text: 'Pierre', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 65, text: 'Lagaffe', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 90, text: 'Thomas', category: 'adresse', certaintyScore: 1 },
    ].map(annotationModule.lib.buildAnnotation);
    const nextAnnotations = [
      { start: 29, text: 'Gaston', category: 'personnePhysiquePrenom', certaintyScore: 1 },
      { start: 40, text: 'Pierre', category: 'personnePhysiquePrenom', certaintyScore: 1 },
      { start: 65, text: 'Lagaffe', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 90, text: 'Thomas', category: 'personnePhysiqueNom', certaintyScore: 1 },
    ].map(annotationModule.lib.buildAnnotation);
    const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(previousAnnotations, nextAnnotations);

    const treatmentInfo = computeTreatmentInfo(annotationsDiff, settings);

    expect(treatmentInfo).toEqual({
      surAnnotationsCount: 0,
      subAnnotationsSensitiveCount: 0,
      subAnnotationsNonSensitiveCount: 0,
    });
  });

  it('should compute the treatments info for a treatment (resize bigger case)', () => {
    const previousAnnotations = [
      { start: 29, text: 'Gaston', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 60, text: 'Pierre', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 90, text: 'Harry', category: 'personnePhysiqueNom', certaintyScore: 1 },
    ].map(annotationModule.lib.buildAnnotation);
    const nextAnnotations = [
      { start: 29, text: 'Gaston Lagaffe', category: 'personnePhysiquePrenom', certaintyScore: 1 },
      { start: 60, text: 'Pierre Lagaffe', category: 'personnePhysiquePrenom', certaintyScore: 1 },
      { start: 90, text: 'Harry Potter', category: 'personnePhysiqueNom', certaintyScore: 1 },
    ].map(annotationModule.lib.buildAnnotation);
    const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(previousAnnotations, nextAnnotations);

    const treatmentInfo = computeTreatmentInfo(annotationsDiff, settings);

    expect(treatmentInfo).toEqual({
      surAnnotationsCount: 0,
      subAnnotationsSensitiveCount: 1,
      subAnnotationsNonSensitiveCount: 2,
    });
  });

  it('should compute the treatments info for a treatment (resize smaller case)', () => {
    const previousAnnotations = [
      { start: 29, text: 'Gaston Lagaffe', category: 'personnePhysiquePrenom', certaintyScore: 1 },
      { start: 60, text: 'Pierre Lagaffe', category: 'personnePhysiquePrenom', certaintyScore: 1 },
      { start: 90, text: 'Harry Potter', category: 'personnePhysiqueNom', certaintyScore: 1 },
    ].map(annotationModule.lib.buildAnnotation);
    const nextAnnotations = [
      { start: 29, text: 'Gaston', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 60, text: 'Pierre', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 90, text: 'Harry', category: 'personnePhysiqueNom', certaintyScore: 1 },
    ].map(annotationModule.lib.buildAnnotation);
    const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(previousAnnotations, nextAnnotations);

    const treatmentInfo = computeTreatmentInfo(annotationsDiff, settings);

    expect(treatmentInfo).toEqual({
      surAnnotationsCount: 3,
      subAnnotationsSensitiveCount: 0,
      subAnnotationsNonSensitiveCount: 0,
    });
  });

  it('should not raise subannotations count if the annotations are split', () => {
    const previousAnnotations = [
      { start: 90, text: 'Harry Potter', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 10, text: 'Bruni-Sarkozy', category: 'personnePhysiqueNom', certaintyScore: 1 },
    ].map(annotationModule.lib.buildAnnotation);
    const nextAnnotations = [
      { start: 10, text: 'Bruni', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 16, text: 'Sarkozy', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 90, text: 'Harry', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 96, text: 'Potter', category: 'personnePhysiqueNom', certaintyScore: 1 },
    ].map(annotationModule.lib.buildAnnotation);
    const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(previousAnnotations, nextAnnotations);

    const treatmentInfo = computeTreatmentInfo(annotationsDiff, settings);

    expect(treatmentInfo).toEqual({
      surAnnotationsCount: 0,
      subAnnotationsSensitiveCount: 0,
      subAnnotationsNonSensitiveCount: 0,
    });
  });

  it('should not raise surannotations count if the annotations are split', () => {
    const previousAnnotations = [
      { start: 90, text: 'Harry', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 96, text: 'Potter', category: 'personnePhysiqueNom', certaintyScore: 1 },
    ].map(annotationModule.lib.buildAnnotation);
    const nextAnnotations = [
      { start: 90, text: 'Harry Potter', category: 'personnePhysiqueNom', certaintyScore: 1 },
    ].map(annotationModule.lib.buildAnnotation);
    const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(previousAnnotations, nextAnnotations);

    const treatmentInfo = computeTreatmentInfo(annotationsDiff, settings);

    expect(treatmentInfo).toEqual({
      surAnnotationsCount: 0,
      subAnnotationsSensitiveCount: 0,
      subAnnotationsNonSensitiveCount: 0,
    });
  });

  it('should raise only one subannotation count if the annotations are of the same', () => {
    const previousAnnotations = [].map(annotationModule.lib.buildAnnotation);
    const nextAnnotations = [
      { start: 29, text: 'Gaston', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 40, text: 'Gaston', category: 'personnePhysiqueNom', certaintyScore: 1 },
    ].map(annotationModule.lib.buildAnnotation);
    const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(previousAnnotations, nextAnnotations);

    const treatmentInfo = computeTreatmentInfo(annotationsDiff, settings);

    expect(treatmentInfo).toEqual({
      surAnnotationsCount: 0,
      subAnnotationsSensitiveCount: 1,
      subAnnotationsNonSensitiveCount: 0,
    });
  });
});
