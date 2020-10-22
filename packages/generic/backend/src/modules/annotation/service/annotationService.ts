import {
  annotationType,
  fetchedAnnotationType,
  idModule,
  idType,
} from '@label/core';
import { buildAnnotationRepository } from '../repository';

export { annotationService };

const annotationService = {
  async fetchAnnotationsOfDocument(
    documentId: string,
  ): Promise<annotationType[]> {
    const annotationRepository = buildAnnotationRepository();
    return annotationRepository.findAllByDocumentId(
      idModule.lib.buildId(documentId),
    );
  },

  async updateAnnotations(
    documentId: idType,
    fetchedAnnotations: fetchedAnnotationType[],
  ): Promise<void> {
    const annotationRepository = buildAnnotationRepository();

    const annotations = fetchedAnnotations.map((fetchedAnnotation) => ({
      ...fetchedAnnotation,
      documentId,
    }));

    await annotationRepository.removeAllByDocumentId(documentId);
    await Promise.all(annotations.map(annotationRepository.insert));
  },
};
