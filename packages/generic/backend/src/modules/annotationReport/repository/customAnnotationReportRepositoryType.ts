import { annotationReportType } from '@label/core';

export type { customAnnotationReportRepositoryType };

type customAnnotationReportRepositoryType = {
  deleteByDocumentId: (
    documentId: annotationReportType['documentId'],
  ) => Promise<void>;
};
