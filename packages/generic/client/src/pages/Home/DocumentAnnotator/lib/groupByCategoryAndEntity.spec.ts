import { annotationModule, fetchedAnnotationType } from '@label/core';
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
  const categories = ['firstName', 'lastName', 'birthDate'];

  it('should group annotations by categories', () => {
    const annotationsPerCategoryAndEntity = groupByCategoryAndEntity(annotations, categories);
    expect(annotationsPerCategoryAndEntity).toEqual([
      {
        category: 'firstName',
        categorySize: 4,
        categoryAnnotations: generateCategoryAnnotations([
          [annotations[0], annotations[3]],
          [annotations[1]],
          [annotations[2]],
        ]),
      },
      {
        category: 'lastName',
        categorySize: 2,
        categoryAnnotations: generateCategoryAnnotations([[annotations[4]], [annotations[5]]]),
      },
      { category: 'birthDate', categorySize: 0, categoryAnnotations: [] },
    ]);
  });
});

function generateCategoryAnnotations(annotationsGroups: fetchedAnnotationType[][]) {
  return annotationsGroups
    .filter((annotations) => annotations.length)
    .map((annotations) => ({ entityId: annotations[0].entityId, entityAnnotations: annotations }));
}
