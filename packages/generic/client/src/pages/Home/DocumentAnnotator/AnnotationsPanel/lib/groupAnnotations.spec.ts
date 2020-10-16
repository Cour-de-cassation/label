import { annotationModule } from '@label/core';
import { groupAnnotations } from './groupAnnotations';

describe('groupAnnotations', () => {
  it('should group annotations by category and text', () => {
    const annotations = [
      { category: 'prenom', text: 'benoit', start: 10 },
      { category: 'prenom', text: 'nicolas', start: 0 },
      { category: 'nom', text: 'serrano', start: 30 },
      { category: 'nom', text: 'serrano', start: 15 },
    ].map(annotationModule.generator.generate);

    const groupedAnnotations = groupAnnotations(annotations);

    expect(groupedAnnotations).toEqual([
      {
        category: 'prenom',
        annotationsAndOccurences: [
          { annotation: annotations[0], occurences: 1 },
          { annotation: annotations[1], occurences: 1 },
        ],
      },
      { category: 'nom', annotationsAndOccurences: [{ annotation: annotations[3], occurences: 2 }] },
    ]);
  });
});
