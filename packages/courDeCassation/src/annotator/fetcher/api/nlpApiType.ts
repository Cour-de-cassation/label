import { documentType, settingsType } from '@label/core';
import { LabelTreatment } from 'dbsder-api-types';

export type { nlpApiType, nlpResponseType, nlpLossType, nlpVersion };

type nlpApiType = {
  fetchNlpAnnotations: (
    settings: settingsType,
    document: documentType,
  ) => Promise<nlpResponseType>;
  fetchNlpLoss: (
    document: documentType,
    treatments: LabelTreatment[],
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
  checklist?: documentType['checklist'];
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
  category: string;
  source: string;
  score: number;
  entityId: string;
};

type nlpLossType = number;
