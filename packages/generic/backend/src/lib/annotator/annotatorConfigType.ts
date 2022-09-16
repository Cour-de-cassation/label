import {
  annotationType,
  annotationReportType,
  documentType,
  idType,
  settingsType,
  treatmentType,
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
  fetchLossOfDocument: (
    document: documentType,
    treatments: treatmentType[],
  ) => Promise<number>;
};
