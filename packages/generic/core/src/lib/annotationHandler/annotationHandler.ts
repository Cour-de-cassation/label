import { annotationModule, fetchedAnnotationType, idModule, idType } from '../../modules';
import { autoLinker } from '../autoLink';

export { annotationHandler };

const annotationHandler = {
  create,
  createAll,
  deleteById,
  deleteByEntityId,
  getAnnotationIndex,
  updateManyCategory,
  updateOneCategory,
  updateOneText,
};

function create<annotationT extends fetchedAnnotationType>(
  annotations: annotationT[],
  fields: { category: string; documentId?: idType; start: number; text: string },
  buildAnnotation: (fields: { category: string; documentId?: idType; start: number; text: string }) => annotationT,
): annotationT[] {
  const createdAnnotation = buildAnnotation(fields);
  const newAnnotations = [createdAnnotation, ...annotations];

  return autoLinker.autoLink([createdAnnotation], newAnnotations);
}

function createAll<annotationT extends fetchedAnnotationType>(
  annotations: annotationT[],
  fields: { category: string; documentId?: idType },
  annotationTextsAndIndices: { index: number; text: string }[],
  buildAnnotation: (fields: { category: string; documentId?: idType; start: number; text: string }) => annotationT,
): annotationT[] {
  const createdAnnotations = annotationTextsAndIndices.map(({ index, text }) =>
    buildAnnotation({ ...fields, start: index, text }),
  );
  const newAnnotations = createdAnnotations.concat(annotations);

  return autoLinker.autoLink(createdAnnotations, newAnnotations);
}

function deleteById<annotationT extends fetchedAnnotationType>(annotations: annotationT[], id: annotationT['_id']) {
  return annotations.filter((annotation) => !idModule.lib.equalId(annotation._id, id));
}

function deleteByEntityId<annotationT extends fetchedAnnotationType>(
  annotations: annotationT[],
  entityId: annotationT['entityId'],
) {
  return annotations.filter((annotation) => annotation.entityId !== entityId);
}

function updateManyCategory<annotationT extends fetchedAnnotationType>(
  annotations: annotationT[],
  entityId: string,
  category: string,
): annotationT[] {
  const { newAnnotations, updatedAnnotations } = annotationModule.lib.annotationUpdater.updateAnnotationsCategory(
    annotations,
    category,
    (annotation) => annotation.entityId === entityId,
  );

  return autoLinker.autoLink(updatedAnnotations, newAnnotations);
}

function updateOneCategory<annotationT extends fetchedAnnotationType>(
  annotations: annotationT[],
  annotationId: idType,
  category: string,
): annotationT[] {
  let updateAnnotation: annotationT | undefined;
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

function updateOneText<annotationT extends fetchedAnnotationType>(
  annotations: annotationT[],
  annotationId: idType,
  text: string,
  start: number,
): annotationT[] {
  let updateAnnotation: annotationT | undefined;
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

function getAnnotationIndex<annotationT extends fetchedAnnotationType>(
  annotations: annotationT[],
  annotation: annotationT,
) {
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
