import { settingsType } from '../../modules/settings';
import { annotationModule, annotationType } from '../../modules/annotation';
import { annotationLinkHandler } from '../annotationLinkHandler';
import { autoLinker } from '../autoLink';

export { annotationHandler };

const annotationHandler = {
  create,
  createManyLinked,
  createAll,
  deleteByTextAndCategory,
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
  settings: settingsType,
): annotationType[] {
  const createdAnnotation = annotationModule.lib.buildAnnotation({ score: 1, source: 'agent', ...fields });
  const newAnnotations = [createdAnnotation, ...annotations];

  return autoLinker.autoLink([createdAnnotation], newAnnotations, settings);
}

function createManyLinked(
  annotations: annotationType[],
  fieldsArray: Array<{ category: string; start: number; text: string }>,
): annotationType[] {
  const createdAnnotations = fieldsArray.map((fields) =>
    annotationModule.lib.buildAnnotation({ score: 1, source: 'agent', ...fields }),
  );
  const linkedAnnotations = createdAnnotations.map((annotation, index) => {
    if (index === 0) {
      return annotation;
    }
    return annotationModule.lib.annotationLinker.link(annotation, createdAnnotations[0]);
  });
  const newAnnotations = [...annotations, ...linkedAnnotations];

  return newAnnotations;
}

function createAll(
  annotations: annotationType[],
  category: string,
  annotationTextsAndIndices: { index: number; text: string }[],
  settings: settingsType,
): annotationType[] {
  const createdAnnotations = annotationTextsAndIndices.map(({ index, text }) =>
    annotationModule.lib.buildAnnotation({ category, start: index, text, score: 1, source: 'agent' }),
  );
  const newAnnotations = createdAnnotations.concat(annotations);

  return autoLinker.autoLink(createdAnnotations, newAnnotations, settings);
}

function deleteByTextAndCategory(annotations: annotationType[], annotation: annotationType) {
  const newAnnotations = annotations.filter(
    (anotherAnnotation) =>
      anotherAnnotation.category !== annotation.category || anotherAnnotation.text !== annotation.text,
  );

  const annotationsLinkedToDeletedAnnotation = annotationLinkHandler.getLinkedAnnotationRepresentatives(
    annotation.entityId,
    newAnnotations,
  );

  if (annotationsLinkedToDeletedAnnotation.length === 0) {
    return newAnnotations;
  } else {
    return annotationLinkHandler.updateMainLinkEntity(annotationsLinkedToDeletedAnnotation[0], newAnnotations);
  }
}

function deleteByTextAndStart(annotations: annotationType[], annotation: annotationType) {
  const newAnnotations = annotations.filter(
    (anotherAnnotation) => anotherAnnotation.text !== annotation.text || anotherAnnotation.start !== annotation.start,
  );

  const annotationsLinkedToDeletedAnnotation = annotationLinkHandler.getLinkedAnnotationRepresentatives(
    annotation.entityId,
    newAnnotations,
  );

  if (annotationsLinkedToDeletedAnnotation.length === 0) {
    return newAnnotations;
  } else {
    return annotationLinkHandler.updateMainLinkEntity(annotationsLinkedToDeletedAnnotation[0], newAnnotations);
  }
}

function deleteByEntityId(annotations: annotationType[], entityId: annotationType['entityId']) {
  return annotations.filter((annotation) => annotation.entityId !== entityId);
}

function updateManyCategory(
  annotations: annotationType[],
  entityId: string,
  category: string,
  settings: settingsType,
): annotationType[] {
  const { newAnnotations, updatedAnnotations } = annotationModule.lib.annotationUpdater.updateAnnotationsCategory(
    annotations,
    category,
    (annotation) => annotation.entityId === entityId,
  );

  return autoLinker.autoLink(updatedAnnotations, newAnnotations, settings);
}

function updateOneCategory(
  annotations: annotationType[],
  text: string,
  start: number,
  category: string,
  settings: settingsType,
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

  return updateAnnotation ? autoLinker.autoLink([updateAnnotation], newAnnotations, settings) : newAnnotations;
}

function updateOneText(
  annotations: annotationType[],
  oldText: string,
  start: number,
  newText: string,
  settings: settingsType,
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

  return updateAnnotation ? autoLinker.autoLink([updateAnnotation], newAnnotations, settings) : newAnnotations;
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
