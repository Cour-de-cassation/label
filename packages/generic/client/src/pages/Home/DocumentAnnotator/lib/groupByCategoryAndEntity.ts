import { groupBy } from 'lodash';
import { fetchedAnnotationType } from '@label/core';

export { groupByCategoryAndEntity };

export type { annotationPerCategoryAndEntityType, annotationPerEntityType };

type annotationPerCategoryAndEntityType = Array<{
  category: string;
  categorySize: number;
  categoryAnnotations: annotationPerEntityType;
}>;

type annotationPerEntityType = Array<{
  entityId: string;
  entityAnnotations: fetchedAnnotationType[];
}>;

function groupByCategoryAndEntity(
  annotations: fetchedAnnotationType[],
  categories: string[],
): annotationPerCategoryAndEntityType {
  return groupByCategory(annotations, categories).map(({ category, categoryAnnotations }) => {
    const grouppedByEntityAnnotations = groupByEntity(categoryAnnotations);
    return {
      category,
      categorySize: grouppedByEntityAnnotations.length,
      categoryAnnotations: grouppedByEntityAnnotations,
    };
  });
}

function groupByCategory(
  annotations: fetchedAnnotationType[],
  categories: string[],
): Array<{ category: string; categoryAnnotations: fetchedAnnotationType[] }> {
  const grouppedByCategoryAnnotations = groupBy(annotations, (annotation) => annotation.category);
  return categories.map((category) => {
    const categoryAnnotations = grouppedByCategoryAnnotations[category];
    if (!!categoryAnnotations) {
      return {
        category,
        categoryAnnotations,
      };
    } else {
      return {
        category,
        categoryAnnotations: [],
      };
    }
  });
}

function groupByEntity(annotations: fetchedAnnotationType[]): annotationPerEntityType {
  return Object.entries(groupBy(annotations, (annotation) => annotation.entityId))
    .map(([entityId, entityAnnotations]) => ({
      entityId,
      entityAnnotations,
    }))
    .sort(
      ({ entityAnnotations: entityAnnotations1 }, { entityAnnotations: entityAnnotations2 }) =>
        entityAnnotations2.length - entityAnnotations1.length,
    );
}
