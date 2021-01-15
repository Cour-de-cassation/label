import { annotationModule, annotationType } from '@label/core';
import { groupByCategoryAndEntity } from './groupByCategoryAndEntity';

describe('groupByCategoryAndEntity', () => {
  const annotations = [
    { category: 'firstName', text: 'Benoit', start: 0 },
    { category: 'firstName', text: 'Nicolas', start: 10 },
    { category: 'firstName', text: 'Romain', start: 20 },
    { category: 'firstName', text: 'Benoit', start: 30 },
    { category: 'lastName', text: 'Dupond', start: 40 },
    { category: 'lastName', text: 'Blanc-Sec', start: 50 },
  ].map(annotationModule.generator.generate);
  const categories = ['lastName', 'firstName', 'birthDate'];

  it('should group annotations by categories', () => {
    const annotationsPerCategoryAndEntity = groupByCategoryAndEntity(annotations, categories);
    expect(annotationsPerCategoryAndEntity).toEqual([
      {
        category: 'lastName',
        categorySize: 2,
        categoryAnnotations: generateCategoryAnnotations([[annotations[4]], [annotations[5]]]),
      },
      {
        category: 'firstName',
        categorySize: 3,
        categoryAnnotations: generateCategoryAnnotations([
          [annotations[0], annotations[3]],
          [annotations[1]],
          [annotations[2]],
        ]),
      },
      { category: 'birthDate', categorySize: 0, categoryAnnotations: [] },
    ]);
  });
});

function generateCategoryAnnotations(annotationsGroups: annotationType[][]) {
  return annotationsGroups
    .filter((annotations) => annotations.length)
    .map((annotations) => ({ entityId: annotations[0].entityId, entityAnnotations: annotations }));
}
