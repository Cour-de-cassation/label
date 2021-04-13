import { uniq } from 'lodash';
import { annotationType, annotationLinkHandler } from '@label/core';

export { computeGenericDocumentInfoEntries };

function computeGenericDocumentInfoEntries(text: string, annotations: annotationType[]) {
  return {
    wordCount: text.split(' ').length,
    annotations: annotations.length,
    linkedEntities: annotationLinkHandler.countLinkedEntities(annotations),
    entities: uniq(annotations.map((annotation) => annotation.entityId)).length,
  };
}
