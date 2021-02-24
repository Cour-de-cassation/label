import { uniq } from 'lodash';
import { annotationModule, annotationType, annotationLinkHandler } from '@label/core';

export { computeDocumentInfoEntries };

function computeDocumentInfoEntries(annotations: annotationType[]) {
  return {
    annotations: annotations.length,
    linkedEntities: computeLinkedEntities(annotations),
    entities: uniq(annotations.map((annotation) => annotation.entityId)).length,
  };
}

function computeLinkedEntities(annotations: annotationType[]) {
  let linkedEntities = 0;
  let representatives = annotationLinkHandler.getRepresentatives(annotations);

  while (representatives.length !== 0) {
    const representative = representatives[0];
    representatives = representatives.slice(1);
    const linkedRepresentatives = annotationLinkHandler.getLinkedAnnotations(representative.entityId, representatives);

    linkedEntities = linkedEntities + linkedRepresentatives.length;
    representatives = representatives.filter((someRepresentative) =>
      linkedRepresentatives.every(
        (linkedRepresentative) => !annotationModule.lib.comparator.equal(someRepresentative, linkedRepresentative),
      ),
    );
  }

  return linkedEntities;
}
