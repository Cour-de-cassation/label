import { annotationReportType } from '@label/core';
import { buildAnnotationReportRepository } from '../repository';

export { annotationReportService };

const annotationReportService = {
  async fetchAnnotationReportByDocumentId(
    documentId: annotationReportType['documentId'],
  ) {
    const annotationReportRepository = buildAnnotationReportRepository();
    return await annotationReportRepository.findByDocumentId(documentId);
  },

  async deleteAnnotationReportsByDocumentId(
    documentId: annotationReportType['documentId'],
  ) {
    const annotationReportRepository = buildAnnotationReportRepository();
    await annotationReportRepository.deleteByDocumentId(documentId);
  },
};
