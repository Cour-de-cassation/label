import { areAnnotationsIncluded } from './areAnnotationsIncluded';
import { buildAnnotation } from './buildAnnotation';

describe('areAnnotationsIncluded', () => {
  it('should return 0 if the annotations are equal', () => {
    const annotation1 = buildAnnotation({ category: 'nom', start: 0, text: 'Marie' });
    const annotation2 = buildAnnotation({ category: 'prenom', start: 0, text: 'Marie' });

    expect(areAnnotationsIncluded(annotation1, annotation2)).toBe(0);
  });

  it('should return 1 if the first annotation contains the second one', () => {
    const annotation1 = buildAnnotation({ category: 'nom', start: 0, text: 'Jean-Marie' });
    const annotation2 = buildAnnotation({ category: 'nom', start: 0, text: 'Jean' });

    expect(areAnnotationsIncluded(annotation1, annotation2)).toBe(1);
  });

  it('should return -1 if the first annotation is contained by the second one', () => {
    const annotation1 = buildAnnotation({ category: 'nom', start: 0, text: 'Jean' });
    const annotation2 = buildAnnotation({ category: 'nom', start: 0, text: 'Jean-Marie' });

    expect(areAnnotationsIncluded(annotation1, annotation2)).toBe(-1);
  });

  it('should return undefined if no annotation contains the other one', () => {
    const annotation1 = buildAnnotation({ category: 'nom', start: 0, text: 'Jean' });
    const annotation2 = buildAnnotation({ category: 'nom', start: 5, text: 'Marie' });

    expect(areAnnotationsIncluded(annotation1, annotation2)).toBe(undefined);
  });
});
