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
  return categories
    .sort((category1, category2) => {
      const category1Annotations = grouppedByCategoryAnnotations[category1];
      const category2Annotations = grouppedByCategoryAnnotations[category2];
      if (category1Annotations && !category2Annotations) {
        return -1;
      }
      if (!category1Annotations && category2Annotations) {
        return 1;
      }
      return 0;
    })
    .map((category) => ({
      category,
      categoryAnnotations: grouppedByCategoryAnnotations[category] || [],
    }));
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
