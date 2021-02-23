import { documentType } from '@label/core';
import { buildAnnotationReportRepository } from '../repository';

export { annotationReportService };

const annotationReportService = {
  async fetchAnnotationReportOfDocument(documentId: documentType['_id']) {
    const annotationReportRepository = buildAnnotationReportRepository();
    return annotationReportRepository.findByDocumentId(documentId);
  },
};
