import { annotationReportType, documentType } from '@label/core';

export type { customAnnotationReportRepositoryType };

type customAnnotationReportRepositoryType = {
  deleteByDocumentId: (
    documentId: annotationReportType['documentId'],
  ) => Promise<void>;
  findByDocumentId: (
    documentId: documentType['_id'],
  ) => Promise<annotationReportType>;
};
