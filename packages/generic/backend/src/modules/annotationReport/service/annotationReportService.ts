import { annotationReportType } from '@label/core';
import { buildAnnotationReportRepository } from '../repository';

export { annotationReportService };

const annotationReportService = {
  async deleteAnnotationReportsByDocumentId(
    documentId: annotationReportType['documentId'],
  ) {
    const annotationReportRepository = buildAnnotationReportRepository();
    await annotationReportRepository.deleteByDocumentId(documentId);
  },
};
