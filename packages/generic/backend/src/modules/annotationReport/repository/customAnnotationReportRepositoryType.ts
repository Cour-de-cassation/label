import { annotationReportType, documentType } from '@label/core';
import { projectedType } from '../../../repository';

export type { customAnnotationReportRepositoryType };

// eslint-disable-next-line @typescript-eslint/ban-types
type customAnnotationReportRepositoryType = {
  deleteByDocumentId: (
    documentId: annotationReportType['documentId'],
  ) => Promise<void>;
  findByDocumentId: (
    documentId: documentType['_id'],
  ) => Promise<annotationReportType>;
  findAllProjection: <projectionT extends keyof annotationReportType>(
    projection: Array<projectionT>,
  ) => Promise<Array<projectedType<annotationReportType, projectionT>>>;
};
