import { buildAnnotation } from './buildAnnotation';
import { stringify } from './stringify';

describe('stringify', () => {
  it('should stringify an annotation without the entityId', () => {
    const annotation = buildAnnotation({ category: 'nom', start: 12, text: 'SERRANO', score: 1, source: 'agent' });

    const stringifyedAnnotation = stringify(annotation);

    expect(stringifyedAnnotation).toBe(`(nom / SERRANO / 12)`);
  });

  it('should stringify an annotation with the entityId', () => {
    const annotation = buildAnnotation({ category: 'nom', start: 12, text: 'SERRANO', score: 1, source: 'agent' });

    const stringifyedAnnotation = stringify(annotation, { displayEntityId: true });

    expect(stringifyedAnnotation).toBe(`(nom / SERRANO (nom_serrano) / 12)`);
  });
});
