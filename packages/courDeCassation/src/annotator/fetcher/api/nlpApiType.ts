import { labelTreatmentsType } from '@label/backend';
import { documentType, settingsType } from '@label/core';

export type { nlpApiType, nlpResponseType, nlpLossType };

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

type nlpResponseType = {
  entities: nlpAnnotationType[];
  checklist: string[];
  newCategoriesToOmit?: string[];
  additionalTermsToAnnotate?: string[];
  additionalTermsToUnAnnotate?: string[];
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
