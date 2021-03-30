import { uniq } from 'lodash';
import { annotationType, annotationLinkHandler } from '@label/core';

export { computeDocumentInfoEntries };

function computeDocumentInfoEntries(annotations: annotationType[]) {
  return {
    annotations: annotations.length,
    linkedEntities: annotationLinkHandler.countLinkedEntities(annotations),
    entities: uniq(annotations.map((annotation) => annotation.entityId)).length,
  };
}
