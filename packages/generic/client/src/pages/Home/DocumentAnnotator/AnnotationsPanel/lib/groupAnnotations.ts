import { groupBy, orderBy } from 'lodash';
import { fetchedAnnotationType } from '../../../../../types';

export { groupAnnotations };

function groupAnnotations(annotations: fetchedAnnotationType[]) {
  const annotationsByCategory: { [category: string]: { annotation: fetchedAnnotationType; occurences: number }[] } = {};

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
