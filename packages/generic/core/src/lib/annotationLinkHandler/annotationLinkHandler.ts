import { groupBy, uniqBy } from 'lodash';
import { annotationModule, annotationType } from '../../modules';

export { annotationLinkHandler };

const annotationLinkHandler = {
  link,
  getRepresentatives,
  getLinkableAnnotations,
  getLinkedAnnotations,
  getLinkedAnnotationRepresentatives,
  isLinked,
  isLinkedTo,
  unlink,
  unlinkByCategoryAndText,
  updateMainLinkEntity,
};

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

function isLinked(annotation: annotationType, annotations: annotationType[]): boolean {
  return annotations.some(
    (otherAnnotation) => otherAnnotation.entityId === annotation.entityId && otherAnnotation.text !== annotation.text,
  );
}

function isLinkedTo(annotationSource: annotationType, annotationTarget: annotationType) {
  return annotationSource.entityId === annotationTarget.entityId;
}

function getRepresentatives(annotations: annotationType[]) {
  return uniqBy(annotations, (otherAnnotation) =>
    annotationModule.lib.entityIdHandler.compute(otherAnnotation.category, otherAnnotation.text),
  ).sort(annotationModule.lib.comparator.compareByText);
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

function getLinkedAnnotations(entityId: annotationType['entityId'], annotations: annotationType[]): annotationType[] {
  return annotations.filter((otherAnnotation) => otherAnnotation.entityId === entityId);
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
