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
    newCategoriesToAnnotate?: string[];
    newCategoriesToUnAnnotate?: string[];
    computedAdditionalTerms?: documentType['decisionMetadata']['computedAdditionalTerms'];
    additionalTermsParsingFailed?: boolean;
    versions: documentType['nlpVersions'];
  }>;
  fetchLossOfDocument: (
    document: documentType,
    treatments: labelTreatmentsType,
  ) => Promise<number>;
};
