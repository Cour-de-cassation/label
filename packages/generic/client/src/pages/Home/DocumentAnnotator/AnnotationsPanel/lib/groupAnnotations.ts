import { groupBy, orderBy } from 'lodash';
import { annotationType } from '@label/core';

export { groupAnnotations };

function groupAnnotations(annotations: annotationType[]) {
  const annotationsByCategory: { [category: string]: { annotation: annotationType; occurences: number }[] } = {};

  for (const [category, annotationsOfCategory] of Object.entries(groupBy(annotations, 'category'))) {
    const annotationsAndOccurences = Object.values(groupBy(annotationsOfCategory, 'text')).map((annotationsByText) => ({
      annotation: orderBy(annotationsByText, (annotationByText) => annotationByText.start)[0],
      occurences: annotationsByText.length,
    }));

    annotationsByCategory[category] = orderBy(
      annotationsAndOccurences,
      (annotationAndOccurences) => annotationAndOccurences.occurences,
      'desc',
    );
  }

  return annotationsByCategory;
}
