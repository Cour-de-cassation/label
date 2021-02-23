import {
  annotationType,
  annotationReportType,
  documentType,
  idType,
  settingsType,
} from '@label/core';

export type { annotatorConfigType };

type annotatorConfigType = {
  name: string;
  fetchAnnotationOfDocument(
    settings: settingsType,
    document: documentType,
  ): Promise<{
    annotations: annotationType[];
    documentId: idType;
    report: annotationReportType;
  }>;
};
