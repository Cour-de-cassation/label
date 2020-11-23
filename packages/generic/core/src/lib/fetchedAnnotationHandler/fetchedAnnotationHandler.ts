import { annotationModule, fetchedAnnotationType, idModule, idType } from '../../modules';
import { autoLinker } from '../autoLink';

export { fetchedAnnotationHandler };

const fetchedAnnotationHandler = {
  create,
  createAll,
  getAnnotationIndex,
  updateManyCategory,
  updateOneCategory,
  updateOneText,
  deleteOne,
};

function create(
  category: string,
  index: number,
  text: string,
  annotations: fetchedAnnotationType[],
): fetchedAnnotationType[] {
  const createdAnnotation = annotationModule.lib.buildFetchedAnnotation({
    category,
    source: annotationModule.config.LABEL_ANNOTATION_SOURCE,
    start: index,
    text,
  });
  const newAnnotations = [createdAnnotation, ...annotations];

  return autoLinker.autoLink([createdAnnotation], newAnnotations);
}

function createAll(
  category: string,
  annotationTextsAndIndices: { index: number; text: string }[],
  annotations: fetchedAnnotationType[],
): fetchedAnnotationType[] {
  const createdAnnotations = annotationTextsAndIndices.map(({ text, index }) =>
    annotationModule.lib.buildFetchedAnnotation({
      category,
      source: annotationModule.config.LABEL_ANNOTATION_SOURCE,
      start: index,
      text,
    }),
  );
  const newAnnotations = createdAnnotations.concat(annotations);

  return autoLinker.autoLink(createdAnnotations, newAnnotations);
}

function updateManyCategory(
  annotations: fetchedAnnotationType[],
  entityId: string,
  category: string,
): fetchedAnnotationType[] {
  const { newAnnotations, updatedAnnotations } = annotationModule.lib.annotationUpdater.updateAnnotationsCategory(
    annotations,
    category,
    (annotation) => annotation.entityId === entityId,
  );

  return autoLinker.autoLink(updatedAnnotations, newAnnotations);
}

function updateOneCategory(annotations: fetchedAnnotationType[], annotationId: idType, category: string) {
  let updateAnnotation: fetchedAnnotationType | undefined;
  const newAnnotations = annotations.map((annotation) => {
    if (idModule.lib.equalId(annotation._id, annotationId)) {
      updateAnnotation = annotation;
      return annotationModule.lib.annotationUpdater.updateAnnotationCategory(annotation, category);
    } else {
      return annotation;
    }
  });

  return updateAnnotation ? autoLinker.autoLink([updateAnnotation], newAnnotations) : newAnnotations;
}

function updateOneText(
  annotations: fetchedAnnotationType[],
  annotationId: idType,
  text: string,
  start: number,
): fetchedAnnotationType[] {
  let updateAnnotation: fetchedAnnotationType | undefined;
  const newAnnotations = annotations.map((annotation) => {
    if (idModule.lib.equalId(annotation._id, annotationId)) {
      updateAnnotation = annotation;
      return annotationModule.lib.annotationUpdater.updateAnnotationText(annotation, text, start);
    } else {
      return annotation;
    }
  });

  return updateAnnotation ? autoLinker.autoLink([updateAnnotation], newAnnotations) : newAnnotations;
}

function deleteOne(annotations: fetchedAnnotationType[], annotationId: fetchedAnnotationType['_id']) {
  return annotations.filter((annotation) => !idModule.lib.equalId(annotation._id, annotationId));
}

function getAnnotationIndex(annotation: fetchedAnnotationType, annotations: fetchedAnnotationType[]) {
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
