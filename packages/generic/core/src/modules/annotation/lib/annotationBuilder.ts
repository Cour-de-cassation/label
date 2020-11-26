import { idModule, idType } from '../../id';
import { LABEL_ANNOTATION_SOURCE } from '../annotationType';
import { entityIdHandler } from './entityIdHandler';

export { annotationBuilder };

const annotationBuilder = {
  buildAnnotation,
  buildFetchedAnnotation,
};

function buildAnnotation({
  category,
  documentId,
  source,
  start,
  text,
}: {
  category: string;
  documentId?: idType;
  source?: string;
  start: number;
  text: string;
}) {
  if (!documentId) {
    throw new Error('Cannot build an annotation without a document id');
  }

  return {
    category,
    documentId,
    entityId: entityIdHandler.compute(category, text),
    _id: idModule.lib.buildId(),
    source: source || LABEL_ANNOTATION_SOURCE,
    start,
    text,
  };
}

function buildFetchedAnnotation({
  category,
  source,
  start,
  text,
}: {
  category: string;
  source?: string;
  start: number;
  text: string;
}) {
  return {
    category,
    entityId: entityIdHandler.compute(category, text),
    _id: idModule.lib.buildId(),
    source: source || LABEL_ANNOTATION_SOURCE,
    start,
    text,
  };
}
