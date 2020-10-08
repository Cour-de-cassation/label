import { annotationModule, annotationType } from '@label/core';
import { groupAnnotations } from './groupAnnotations';

describe('groupAnnotations', () => {
  it('should group annotations by category and text', () => {
    const annotations = [
      { category: 'prenom', text: 'benoit' },
      { category: 'prenom', text: 'nicolas' },
      { category: 'nom', text: 'serrano' },
      { category: 'nom', text: 'serrano' },
    ].map(annotationModule.generator.generate);

    const groupedAnnotations = groupAnnotations(annotations);

    expect(groupedAnnotations).toEqual({
      prenom: { benoit: [annotations[0]], nicolas: [annotations[1]] },
      nom: { serrano: [annotations[2], annotations[3]] },
    });
  });
});
