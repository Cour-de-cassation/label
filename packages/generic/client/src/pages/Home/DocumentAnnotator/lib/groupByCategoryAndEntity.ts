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
  return groupByCategory(annotations, categories).map(({ category, categoryAnnotations }) => ({
    category,
    categorySize: categoryAnnotations.length,
    categoryAnnotations: groupByEntity(categoryAnnotations),
  }));
}

function groupByCategory(
  annotations: fetchedAnnotationType[],
  categories: string[],
): Array<{ category: string; categoryAnnotations: fetchedAnnotationType[] }> {
  const categoriesWithAnnotations = Object.entries(groupBy(annotations, (annotation) => annotation.category));
  const categoriesWithoutAnnotations: [string, fetchedAnnotationType[]][] = categories
    .filter(
      (category) => !categoriesWithAnnotations.some((categoryWithAnnotation) => category === categoryWithAnnotation[0]),
    )
    .map((category) => [category, []]);
  const allCategories = [...categoriesWithAnnotations, ...categoriesWithoutAnnotations];
  return allCategories
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
