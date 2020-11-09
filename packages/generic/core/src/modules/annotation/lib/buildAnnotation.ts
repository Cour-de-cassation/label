import { idModule, omitIdType } from '../../id';
import { annotationType, fetchedAnnotationType } from '../annotationType';
import { entityIdHandler } from './entityIdHandler';

export { buildAnnotation, buildFetchedAnnotation };

function buildAnnotation(annotationFields: Omit<omitIdType<annotationType>, 'entityId'>): annotationType {
  return {
    ...annotationFields,
    entityId: entityIdHandler.compute(annotationFields.category, annotationFields.text),
    _id: idModule.lib.buildId(),
  };
}

function buildFetchedAnnotation(
  fetchedAnnotationFields: Omit<omitIdType<fetchedAnnotationType>, 'entityId'>,
): fetchedAnnotationType {
  return {
    ...fetchedAnnotationFields,
    entityId: entityIdHandler.compute(fetchedAnnotationFields.category, fetchedAnnotationFields.text),
    _id: idModule.lib.buildId(),
  };
}
