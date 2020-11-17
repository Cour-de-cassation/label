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

function groupByCategoryAndEntity(annotations: fetchedAnnotationType[]): annotationPerCategoryAndEntityType {
  return groupByCategory(annotations).map(({ category, categoryAnnotations }) => ({
    category,
    categorySize: categoryAnnotations.length,
    categoryAnnotations: groupByEntity(categoryAnnotations),
  }));
}

function groupByCategory(
  annotations: fetchedAnnotationType[],
): Array<{ category: string; categoryAnnotations: fetchedAnnotationType[] }> {
  return Object.entries(groupBy(annotations, (annotation) => annotation.category))
    .map(([category, categoryAnnotations]) => ({
      category,
      categoryAnnotations,
    }))
    .sort(
      ({ categoryAnnotations: categoryAnnotations1 }, { categoryAnnotations: categoryAnnotations2 }) =>
        categoryAnnotations2.length - categoryAnnotations1.length,
    );
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
