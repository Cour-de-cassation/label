import { uniq, groupBy } from 'lodash';
import { fetchedAnnotationType } from '@label/core';

export { computeDocumentInfoEntries };

function computeDocumentInfoEntries(annotations: fetchedAnnotationType[]) {
  return {
    annotations: annotations.length,
    linkedEntities: Object.values(groupBy(annotations, (annotation) => annotation.entityId)).filter(
      (groupedAnnotations) => groupedAnnotations.length > 1,
    ).length,
    entities: uniq(annotations.map((annotation) => annotation.entityId)).length,
  };
}
