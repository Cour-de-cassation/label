import { annotationReportType } from '@label/core';

export type { customAnnotationReportRepositoryType };

type customAnnotationReportRepositoryType = {
  findByDocumentId: (
    documentId: annotationReportType['documentId'],
  ) => Promise<annotationReportType | undefined>;
  deleteByDocumentId: (
    documentId: annotationReportType['documentId'],
  ) => Promise<void>;
};
