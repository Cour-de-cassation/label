import { annotationType, idModule } from '@label/core';
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
};
