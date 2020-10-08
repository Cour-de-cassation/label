import { groupBy } from 'lodash';
import { annotationType } from '@label/core';

export { groupAnnotations };

function groupAnnotations(annotations: annotationType[]) {
  const annotationsByCategory = groupBy(annotations, 'category');

  const annotationsByCategoryAndText: { [key: string]: { [key: string]: annotationType[] } } = {};
  Object.keys(annotationsByCategory).forEach(
    (category) => (annotationsByCategoryAndText[category] = groupBy(annotationsByCategory[category], 'text')),
  );

  return annotationsByCategoryAndText;
}
