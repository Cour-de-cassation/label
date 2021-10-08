import { buildAnnotation } from './buildAnnotation';
import { isAnnotationTextInAnnotations } from './isAnnotationTextInAnnotations';

describe('isAnnotationTextInAnnotations', () => {
  it('should return true if the annotation text is in annotations with space', () => {
    const annotation = buildAnnotation({
      start: 90,
      text: 'Harry Potter',
      category: 'personnePhysiqueNom',
    });
    const annotationsToSearchIn = [
      { start: 90, text: 'Harry', category: 'personnePhysiqueNom' },
      { start: 96, text: 'Potter', category: 'personnePhysiqueNom' },
    ].map(buildAnnotation);

    expect(isAnnotationTextInAnnotations(annotation, annotationsToSearchIn)).toBe(true);
  });

  it('should return true if the annotation text is in annotations with dash', () => {
    const annotation = buildAnnotation({
      start: 90,
      text: 'Bruni-Sarkozy',
      category: 'personnePhysiqueNom',
    });
    const annotationsToSearchIn = [
      { start: 90, text: 'Bruni', category: 'personnePhysiqueNom' },
      { start: 96, text: 'Sarkozy', category: 'personnePhysiqueNom' },
    ].map(buildAnnotation);

    expect(isAnnotationTextInAnnotations(annotation, annotationsToSearchIn)).toBe(true);
  });

  it('should return false if the annotation text is not in annotations', () => {
    const annotation = buildAnnotation({
      start: 90,
      text: 'Harry Potter',
      category: 'personnePhysiqueNom',
    });
    const annotationsToSearchIn = [
      { start: 90, text: 'Harry', category: 'personnePhysiqueNom' },
      { start: 150, text: 'Potter', category: 'personnePhysiqueNom' },
    ].map(buildAnnotation);

    expect(isAnnotationTextInAnnotations(annotation, annotationsToSearchIn)).toBe(false);
  });
});
