import {
  annotationType,
  annotationReportType,
  documentType,
} from '@label/core';

export type { annotatorConfigType };

type annotatorConfigType = {
  name: string;
  fetchAnnotationOfDocument(
    document: documentType,
  ): Promise<{
    annotations: annotationType[];
    report: annotationReportType;
  }>;
};
