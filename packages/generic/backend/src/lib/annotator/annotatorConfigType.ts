import {
  annotationType,
  annotationReportType,
  documentType,
  idType,
  settingsType,
} from '@label/core';
import { labelTreatmentsType } from 'sder';

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
    treatments: labelTreatmentsType,
  ) => Promise<number>;
};
