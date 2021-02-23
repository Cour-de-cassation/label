import { annotationReportType, documentType } from '@label/core';

export type { customAnnotationReportRepositoryType };

// eslint-disable-next-line @typescript-eslint/ban-types
type customAnnotationReportRepositoryType = {
  findByDocumentId: (
    documentId: documentType['_id'],
  ) => Promise<annotationReportType>;
};
