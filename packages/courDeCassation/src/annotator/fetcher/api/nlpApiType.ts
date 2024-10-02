import { labelTreatmentsType } from 'sder';
import { annotationReportType, documentType, settingsType } from '@label/core';

export type { nlpApiType, nlpResponseType, nlpLossType, nlpVersion };

type nlpApiType = {
  fetchNlpAnnotations: (
    settings: settingsType,
    document: documentType,
  ) => Promise<nlpResponseType>;
  fetchNlpLoss: (
    document: documentType,
    treatments: labelTreatmentsType,
  ) => Promise<nlpLossType>;
};

type nlpVersionDetails = {
  version: string;
  date: string;
};
type nlpVersion = {
  juriSpacyTokenizer: nlpVersionDetails;
  juritools: nlpVersionDetails;
  pseudonymisationApi: nlpVersionDetails;
  model: {
    name: string;
  };
};

type nlpResponseType = {
  entities: nlpAnnotationType[];
  checklist: annotationReportType['checklist'];
  newCategoriesToAnnotate?: string[];
  newCategoriesToUnAnnotate?: string[];
  additionalTermsToAnnotate?: string[];
  additionalTermsToUnAnnotate?: string[];
  additionalTermsParsingFailed?: boolean;
  versions: nlpVersion;
};

type nlpAnnotationType = {
  text: string;
  start: number;
  end: number;
  label: string;
  source: string;
  score: number;
  entityId: string;
};

type nlpLossType = number;
