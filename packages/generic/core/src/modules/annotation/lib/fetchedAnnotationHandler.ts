import { idModule, idType } from '../../id';
import { fetchedAnnotationType } from '../annotationType';
import { annotationUpdater } from './annotationUpdater';
import { buildFetchedAnnotation } from './buildAnnotation';

export { fetchedAnnotationHandler, LABEL_ANNOTATION_SOURCE };

const fetchedAnnotationHandler = {
  create,
  createAll,
  getAnnotationIndex,
  updateManyCategory,
  updateOneCategory,
  updateOneText,
  deleteOne,
};

const LABEL_ANNOTATION_SOURCE = 'label';

function create(category: string, index: number, text: string): fetchedAnnotationType {
  return buildFetchedAnnotation({
    category,
    source: LABEL_ANNOTATION_SOURCE,
    start: index,
    text,
  });
}

function createAll(category: string, annotationTextsAndIndices: { index: number; text: string }[]) {
  return annotationTextsAndIndices.map(({ text, index }) => create(category, index, text));
}

function updateManyCategory(
  annotations: fetchedAnnotationType[],
  entityId: string,
  category: string,
): fetchedAnnotationType[] {
  return annotationUpdater.updateAnnotationsCategory(
    annotations,
    category,
    (annotation) => annotation.entityId === entityId,
  );
}

function updateOneCategory(annotations: fetchedAnnotationType[], annotationId: idType, category: string) {
  return annotations.map((annotation) =>
    idModule.lib.equalId(annotation._id, annotationId)
      ? annotationUpdater.updateAnnotationCategory(annotation, category)
      : annotation,
  );
}

function updateOneText(
  annotations: fetchedAnnotationType[],
  annotationId: idType,
  text: string,
  start: number,
): fetchedAnnotationType[] {
  return annotations.map((annotation) =>
    idModule.lib.equalId(annotation._id, annotationId)
      ? annotationUpdater.updateAnnotationText(annotation, text, start)
      : annotation,
  );
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
