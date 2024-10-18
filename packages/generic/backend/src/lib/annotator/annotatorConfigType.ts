import {
  annotationType,
  annotationReportType,
  documentType,
  idType,
  settingsType,
} from '@label/core';
import { LabelTreatment } from 'dbsder-api-types';

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
    version: documentType['nlpVersions'];
  }>;
  fetchLossOfDocument: (
    document: documentType,
    treatments: LabelTreatment,
  ) => Promise<number>;
};
