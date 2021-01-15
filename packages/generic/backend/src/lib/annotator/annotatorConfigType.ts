import {
  annotationType,
  annotationReportType,
  documentType,
  idType,
} from '@label/core';

export type { annotatorConfigType };

type annotatorConfigType = {
  name: string;
  fetchAnnotationOfDocument(
    document: documentType,
  ): Promise<{
    annotations: annotationType[];
    documentId: idType;
    report: annotationReportType;
  }>;
};
