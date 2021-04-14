import { annotationReportType, documentType } from '@label/core';
import { buildAnnotationReportRepository } from '../repository';

export { annotationReportService };

const annotationReportService = {
  async deleteAnnotationReportsByDocumentId(
    documentId: annotationReportType['documentId'],
  ) {
    const annotationReportRepository = buildAnnotationReportRepository();
    await annotationReportRepository.deleteByDocumentId(documentId);
  },

  async fetchAnnotationReportOfDocument(documentId: documentType['_id']) {
    const annotationReportRepository = buildAnnotationReportRepository();
    return annotationReportRepository.findByDocumentId(documentId);
  },

  async fetchDocumentIdsWithAnnotationReport() {
    const annotationReportRepository = buildAnnotationReportRepository();
    const documentIdsWithAnnotationReport = await annotationReportRepository.findAllProjection(
      ['documentId'],
    );
    return documentIdsWithAnnotationReport.map(({ documentId }) => documentId);
  },
};
