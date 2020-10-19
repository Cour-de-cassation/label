import { groupBy, orderBy } from 'lodash';
import { fetchedAnnotationType } from '@label/core';

export { groupAnnotations };

function groupAnnotations(annotations: fetchedAnnotationType[]) {
  const annotationsByCategory: Array<{
    category: string;
    annotationsAndOccurences: Array<{ annotation: fetchedAnnotationType; occurences: number }>;
  }> = [];

  for (const [category, annotationsOfCategory] of Object.entries(groupBy(annotations, 'category'))) {
    const annotationsAndOccurences = Object.values(groupBy(annotationsOfCategory, 'text')).map((annotationsByText) => ({
      annotation: orderBy(annotationsByText, (annotationByText) => annotationByText.start)[0],
      occurences: annotationsByText.length,
    }));

    annotationsByCategory.push({
      category,
      annotationsAndOccurences: orderBy(
        annotationsAndOccurences,
        (annotationAndOccurences) => annotationAndOccurences.occurences,
        'desc',
      ),
    });
  }

  return orderBy(annotationsByCategory, (annotations) => annotations.annotationsAndOccurences.length, 'desc');
}
