import { buildAnnotation } from './buildAnnotation';
import { isAnnotationTextInAnnotations } from './isAnnotationTextInAnnotations';

describe('isAnnotationTextInAnnotations', () => {
  it('should return true if the annotation text is in annotations with space', () => {
    const annotation = buildAnnotation({
      start: 90,
      text: 'Harry Potter',
      category: 'personnePhysiqueNom',
      certaintyScore: 1,
    });
    const annotationsToSearchIn = [
      { start: 90, text: 'Harry', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 96, text: 'Potter', category: 'personnePhysiqueNom', certaintyScore: 1 },
    ].map(buildAnnotation);

    expect(isAnnotationTextInAnnotations(annotation, annotationsToSearchIn)).toBe(true);
  });

  it('should return true if the annotation text is in annotations with dash', () => {
    const annotation = buildAnnotation({
      start: 90,
      text: 'Bruni-Sarkozy',
      category: 'personnePhysiqueNom',
      certaintyScore: 1,
    });
    const annotationsToSearchIn = [
      { start: 90, text: 'Bruni', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 96, text: 'Sarkozy', category: 'personnePhysiqueNom', certaintyScore: 1 },
    ].map(buildAnnotation);

    expect(isAnnotationTextInAnnotations(annotation, annotationsToSearchIn)).toBe(true);
  });

  it('should return false if the annotation text is not in annotations', () => {
    const annotation = buildAnnotation({
      start: 90,
      text: 'Harry Potter',
      category: 'personnePhysiqueNom',
      certaintyScore: 1,
    });
    const annotationsToSearchIn = [
      { start: 90, text: 'Harry', category: 'personnePhysiqueNom', certaintyScore: 1 },
      { start: 150, text: 'Potter', category: 'personnePhysiqueNom', certaintyScore: 1 },
    ].map(buildAnnotation);

    expect(isAnnotationTextInAnnotations(annotation, annotationsToSearchIn)).toBe(false);
  });
});
