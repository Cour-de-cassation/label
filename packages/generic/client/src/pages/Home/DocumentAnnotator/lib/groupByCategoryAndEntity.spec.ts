import { annotationModule, annotationType } from '@label/core';
import { groupByCategoryAndEntity } from './groupByCategoryAndEntity';

describe('groupByCategoryAndEntity', () => {
  it('should group annotations by categories', () => {
    const annotations = [
      { category: 'firstName', text: 'Benoit', start: 0 },
      { category: 'firstName', text: 'Nicolas', start: 10 },
      { category: 'firstName', text: 'Romain', start: 20 },
      { category: 'firstName', text: 'Benoit', start: 30 },
      { category: 'lastName', text: 'Dupond', start: 40 },
      { category: 'lastName', text: 'Blanc-Sec', start: 50 },
    ].map(annotationModule.generator.generate);
    const categories = ['lastName', 'firstName', 'birthDate'];

    const annotationsPerCategoryAndEntity = groupByCategoryAndEntity(annotations, categories);

    expect(annotationsPerCategoryAndEntity).toEqual([
      {
        category: 'lastName',
        categorySize: 2,
        categoryAnnotations: generateCategoryAnnotations([[annotations[5]], [annotations[4]]]),
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

  it('should group annotations by categorie and place the non empty ones first', () => {
    const annotations = [
      { category: 'birthDate', text: '17/04/2001', start: 40 },
      { category: 'firstName', text: 'Nicolas', start: 0 },
    ].map(annotationModule.generator.generate);
    const categories = ['lastName', 'firstName', 'birthDate'];

    const annotationsPerCategoryAndEntity = groupByCategoryAndEntity(annotations, categories);

    expect(annotationsPerCategoryAndEntity).toEqual([
      {
        category: 'firstName',
        categorySize: 1,
        categoryAnnotations: generateCategoryAnnotations([[annotations[1]]]),
      },
      {
        category: 'birthDate',
        categorySize: 1,
        categoryAnnotations: generateCategoryAnnotations([[annotations[0]]]),
      },
      { category: 'lastName', categorySize: 0, categoryAnnotations: [] },
    ]);
  });
});

function generateCategoryAnnotations(annotationsGroups: annotationType[][]) {
  return annotationsGroups
    .filter((annotations) => annotations.length)
    .map((annotations) => ({ entityId: annotations[0].entityId, entityAnnotations: annotations }));
}
