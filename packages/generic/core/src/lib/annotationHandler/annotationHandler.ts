import { annotationModule, annotationType } from '../../modules';
import { autoLinker } from '../autoLink';

export { annotationHandler };

const annotationHandler = {
  create,
  createAll,
  deleteByTextAndStart,
  deleteByEntityId,
  getAnnotationIndex,
  updateManyCategory,
  updateOneCategory,
  updateOneText,
};

function create(
  annotations: annotationType[],
  fields: { category: string; start: number; text: string },
): annotationType[] {
  const createdAnnotation = annotationModule.lib.buildAnnotation(fields);
  const newAnnotations = [createdAnnotation, ...annotations];

  return autoLinker.autoLink([createdAnnotation], newAnnotations);
}

function createAll(
  annotations: annotationType[],
  category: string,
  annotationTextsAndIndices: { index: number; text: string }[],
): annotationType[] {
  const createdAnnotations = annotationTextsAndIndices.map(({ index, text }) =>
    annotationModule.lib.buildAnnotation({ category, start: index, text }),
  );
  const newAnnotations = createdAnnotations.concat(annotations);

  return autoLinker.autoLink(createdAnnotations, newAnnotations);
}

function deleteByTextAndStart(
  annotations: annotationType[],
  text: annotationType['text'],
  start: annotationType['start'],
) {
  return annotations.filter((annotation) => annotation.text !== text || annotation.start !== start);
}

function deleteByEntityId(annotations: annotationType[], entityId: annotationType['entityId']) {
  return annotations.filter((annotation) => annotation.entityId !== entityId);
}

function updateManyCategory(annotations: annotationType[], entityId: string, category: string): annotationType[] {
  const { newAnnotations, updatedAnnotations } = annotationModule.lib.annotationUpdater.updateAnnotationsCategory(
    annotations,
    category,
    (annotation) => annotation.entityId === entityId,
  );

  return autoLinker.autoLink(updatedAnnotations, newAnnotations);
}

function updateOneCategory(
  annotations: annotationType[],
  text: string,
  start: number,
  category: string,
): annotationType[] {
  let updateAnnotation: annotationType | undefined;
  const newAnnotations = annotations.map((annotation) => {
    if (annotation.text === text && annotation.start === start) {
      updateAnnotation = annotation;
      return annotationModule.lib.annotationUpdater.updateAnnotationCategory(annotation, category);
    } else {
      return annotation;
    }
  });

  return updateAnnotation ? autoLinker.autoLink([updateAnnotation], newAnnotations) : newAnnotations;
}

function updateOneText(
  annotations: annotationType[],
  oldText: string,
  start: number,
  newText: string,
): annotationType[] {
  let updateAnnotation: annotationType | undefined;
  const newAnnotations = annotations.map((annotation) => {
    if (annotation.text === oldText && annotation.start === start) {
      updateAnnotation = annotation;
      return annotationModule.lib.annotationUpdater.updateAnnotationText(annotation, newText, start);
    } else {
      return annotation;
    }
  });

  return updateAnnotation ? autoLinker.autoLink([updateAnnotation], newAnnotations) : newAnnotations;
}

function getAnnotationIndex(annotations: annotationType[], annotation: annotationType) {
  const sameEntityAnnotations = annotations.filter(
    (anotherAnnotation) => anotherAnnotation.entityId === annotation.entityId,
  );
  const sortedSameEntityAnnotations = sameEntityAnnotations.sort(
    (sameEntityAnnotation1, sameEntityAnnotation2) => sameEntityAnnotation1.start - sameEntityAnnotation2.start,
  );
  const annotationIndex = sortedSameEntityAnnotations.findIndex(
    (sameEntityAnnotation) => sameEntityAnnotation.start === annotation.start,
  );

  return { index: annotationIndex + 1, total: sameEntityAnnotations.length };
}
