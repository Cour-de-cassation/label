import { labelTreatmentsType } from '@label/backend';
import { documentType, settingsType } from '@label/core';

export type { nlpApiType, nlpAnnotationsType, nlpLossType };

type nlpApiType = {
  fetchNlpAnnotations: (
    settings: settingsType,
    document: documentType,
  ) => Promise<nlpAnnotationsType>;
  fetchNlpLoss: (
    document: documentType,
    treatments: labelTreatmentsType,
  ) => Promise<nlpLossType>;
};

type nlpAnnotationsType = {
  entities: nlpAnnotationType[];
  checklist: string[];
  categories?: string[];
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
