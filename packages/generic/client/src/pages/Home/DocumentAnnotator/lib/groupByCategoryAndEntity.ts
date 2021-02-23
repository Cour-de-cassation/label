import { groupBy } from 'lodash';
import { annotationModule, annotationType } from '@label/core';

export { groupByCategoryAndEntity };

export type { annotationPerCategoryAndEntityType, annotationPerEntityType };

type annotationPerCategoryAndEntityType = Array<{
  category: string;
  categorySize: number;
  categoryAnnotations: annotationPerEntityType;
}>;

type annotationPerEntityType = Array<{
  entityId: string;
  entityAnnotations: annotationType[];
}>;

function groupByCategoryAndEntity(
  annotations: annotationType[],
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
  annotations: annotationType[],
  categories: string[],
): Array<{ category: string; categoryAnnotations: annotationType[] }> {
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

function groupByEntity(annotations: annotationType[]): annotationPerEntityType {
  return Object.entries(groupBy(annotations, (annotation) => annotation.entityId))
    .map(([entityId, entityAnnotations]) => ({
      entityId,
      entityAnnotations: entityAnnotations.sort(annotationModule.lib.comparator.compareByText),
    }))
    .sort(({ entityAnnotations: entityAnnotations1 }, { entityAnnotations: entityAnnotations2 }) =>
      annotationModule.lib.comparator.compareByText(entityAnnotations1[0], entityAnnotations2[0]),
    );
}
