import { uniqBy } from 'lodash';
import { fetchedAnnotationType } from '../annotationType';
import { entityIdHandler } from './entityIdHandler';

export { annotationLinker };

const annotationLinker = {
  link,
  getLinkableAnnotations,
  getLinkedAnnotations,
  isLinked,
  isLinkedTo,
  unlink,
  unlinkByCategoryAndText,
};

function link<annotationT extends fetchedAnnotationType>(
  annotationSource: annotationT,
  annotationTarget: annotationT,
  annotations: annotationT[],
): annotationT[] {
  return annotations.map((annotation) =>
    annotation.entityId === annotationSource.entityId
      ? { ...annotation, entityId: annotationTarget.entityId }
      : annotation,
  );
}

function isLinked<annotationT extends fetchedAnnotationType>(
  annotation: annotationT,
  annotations: annotationT[],
): boolean {
  return annotations.some(
    (otherAnnotation) => otherAnnotation.entityId === annotation.entityId && otherAnnotation.text !== annotation.text,
  );
}

function isLinkedTo<annotationT extends fetchedAnnotationType>(
  annotationSource: annotationT,
  annotationTarget: annotationT,
) {
  return annotationSource.entityId === annotationTarget.entityId;
}

function getLinkedAnnotations<annotationT extends fetchedAnnotationType>(
  annotation: annotationT,
  annotations: annotationT[],
): annotationT[] {
  return uniqBy(
    annotations.filter((otherAnnotation) => otherAnnotation.entityId === annotation.entityId),
    (otherAnnotation) => otherAnnotation.text,
  ).sort((annotation1, annotation2) => annotation1.text.localeCompare(annotation2.text));
}

function getLinkableAnnotations<annotationT extends fetchedAnnotationType>(
  annotation: annotationT,
  annotations: annotationT[],
): annotationT[] {
  return uniqBy(
    annotations.filter(
      (otherAnnotation) =>
        otherAnnotation.category === annotation.category && otherAnnotation.entityId !== annotation.entityId,
    ),
    (otherAnnotation) => otherAnnotation.entityId,
  ).sort((annotation1, annotation2) => annotation1.text.localeCompare(annotation2.text));
}

function unlink<annotationT extends fetchedAnnotationType>(
  annotationToUnlink: annotationT,
  annotations: annotationT[],
): annotationT[] {
  return annotations.map((annotation) =>
    annotation.entityId === annotationToUnlink.entityId
      ? { ...annotation, entityId: entityIdHandler.compute(annotation.category, annotation.text) }
      : annotation,
  );
}

function unlinkByCategoryAndText<annotationT extends fetchedAnnotationType>(
  annotation: annotationT,
  annotations: annotationT[],
) {
  const linkedAnnotations = getLinkedAnnotations(annotation, annotations);

  if (linkedAnnotations.length === 0) {
    return annotations;
  }

  const annotationsWithUpdatedLink = updateMainLinkEntity(linkedAnnotations[0], annotations);

  return annotationsWithUpdatedLink.map((otherAnnotation) =>
    otherAnnotation.category === annotation.category && otherAnnotation.text === annotation.text
      ? { ...otherAnnotation, entityId: entityIdHandler.compute(annotation.category, annotation.text) }
      : otherAnnotation,
  );
}

function updateMainLinkEntity<annotationT extends fetchedAnnotationType>(
  annotation: annotationT,
  annotations: annotationT[],
) {
  return annotations.map((otherAnnotation) =>
    otherAnnotation.entityId === annotation.entityId
      ? { ...otherAnnotation, entityId: entityIdHandler.compute(annotation.category, annotation.text) }
      : otherAnnotation,
  );
}
