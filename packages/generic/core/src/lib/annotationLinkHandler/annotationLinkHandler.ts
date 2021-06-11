import { groupBy, uniqBy } from 'lodash';
import { annotationModule, annotationType } from '../../modules/annotation';

export { annotationLinkHandler };

const annotationLinkHandler = {
  countLinkedEntities,
  getLinkableAnnotations,
  getLinkedAnnotations,
  getLinkedAnnotationRepresentatives,
  getRepresentatives,
  isLinked,
  isLinkedTo,
  link,
  unlink,
  unlinkByCategoryAndText,
  updateMainLinkEntity,
};

function countLinkedEntities(annotations: annotationType[]) {
  let linkedEntities = 0;
  let representatives = getRepresentatives(annotations);

  while (representatives.length !== 0) {
    const representative = representatives[0];
    representatives = representatives.slice(1);
    const linkedRepresentatives = getLinkedAnnotations(representative.entityId, representatives);

    linkedEntities = linkedEntities + linkedRepresentatives.length;
    representatives = representatives.filter((someRepresentative) =>
      linkedRepresentatives.every(
        (linkedRepresentative) => !annotationModule.lib.comparator.equal(someRepresentative, linkedRepresentative),
      ),
    );
  }

  return linkedEntities;
}

function getLinkableAnnotations(annotation: annotationType, annotations: annotationType[]): annotationType[] {
  const annotationsWithOtherEntityId = annotations.filter(
    (otherAnnotation) =>
      otherAnnotation.category === annotation.category && otherAnnotation.entityId !== annotation.entityId,
  );
  const annotationsWithOtherEntityIdByEntityId = groupBy(
    annotationsWithOtherEntityId,
    (annotation) => annotation.entityId,
  );
  const linkeableAnnotations = Object.values(annotationsWithOtherEntityIdByEntityId)
    .sort((annotations1, annotations2) => annotations2.length - annotations1.length)
    .map((annotations) => annotations[0]);

  return linkeableAnnotations;
}

function getLinkedAnnotations(entityId: annotationType['entityId'], annotations: annotationType[]): annotationType[] {
  return annotations.filter((otherAnnotation) => otherAnnotation.entityId === entityId);
}

function getLinkedAnnotationRepresentatives(
  entityId: annotationType['entityId'],
  annotations: annotationType[],
): annotationType[] {
  return uniqBy(
    getLinkedAnnotations(entityId, annotations),
    (otherAnnotation) => otherAnnotation.text,
  ).sort((annotation1, annotation2) => annotation1.text.localeCompare(annotation2.text));
}

function getRepresentatives(annotations: annotationType[]) {
  return uniqBy(annotations, (otherAnnotation) =>
    annotationModule.lib.entityIdHandler.compute(otherAnnotation.category, otherAnnotation.text),
  ).sort(annotationModule.lib.comparator.compareByText);
}

function isLinked(annotation: annotationType, annotations: annotationType[]): boolean {
  return annotations.some(
    (otherAnnotation) => otherAnnotation.entityId === annotation.entityId && otherAnnotation.text !== annotation.text,
  );
}

function isLinkedTo(annotationSource: annotationType, annotationTarget: annotationType) {
  return annotationSource.entityId === annotationTarget.entityId;
}

function link(
  annotationSource: annotationType,
  annotationTarget: annotationType,
  annotations: annotationType[],
): annotationType[] {
  return annotations.map((annotation) =>
    annotation.entityId === annotationSource.entityId
      ? annotationModule.lib.annotationLinker.link(annotation, annotationTarget)
      : annotation,
  );
}

function unlink(annotationToUnlink: annotationType, annotations: annotationType[]): annotationType[] {
  return annotations.map((annotation) =>
    annotation.entityId === annotationToUnlink.entityId
      ? annotationModule.lib.annotationLinker.unlink(annotation)
      : annotation,
  );
}

function unlinkByCategoryAndText(annotation: annotationType, annotations: annotationType[]) {
  const linkedAnnotations = getLinkedAnnotationRepresentatives(annotation.entityId, annotations).filter(
    (linkedAnnotation) => linkedAnnotation.start !== annotation.start || linkedAnnotation.text !== annotation.text,
  );

  if (linkedAnnotations.length === 0) {
    return annotations;
  }

  const annotationsWithUpdatedLink = updateMainLinkEntity(linkedAnnotations[0], annotations);

  return annotationsWithUpdatedLink.map((otherAnnotation) =>
    otherAnnotation.category === annotation.category && otherAnnotation.text === annotation.text
      ? annotationModule.lib.annotationLinker.unlink(otherAnnotation)
      : otherAnnotation,
  );
}

function updateMainLinkEntity(annotation: annotationType, annotations: annotationType[]) {
  return annotations.map((otherAnnotation) =>
    otherAnnotation.entityId === annotation.entityId
      ? {
          ...otherAnnotation,
          entityId: annotationModule.lib.entityIdHandler.compute(annotation.category, annotation.text),
        }
      : otherAnnotation,
  );
}
