import { annotationType, buildMongoId } from '@label/core';
import { buildAnnotationRepository } from '../repository';

export { annotationService };

const annotationService = {
  async fetchAnnotationsOfDocument(
    documentId: string,
  ): Promise<annotationType[]> {
    const annotationRepository = buildAnnotationRepository();
    return annotationRepository.findAllByDocumentId(buildMongoId(documentId));
  },
};
