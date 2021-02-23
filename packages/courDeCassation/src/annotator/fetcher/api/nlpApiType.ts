import { documentType, settingsType } from '@label/core';

export type { nlpApiType, nlpAnnotationsType };

type nlpApiType = {
  fetchNlpAnnotations: (
    settings: settingsType,
    document: documentType,
  ) => Promise<nlpAnnotationsType>;
};

type nlpAnnotationsType = {
  entities: nlpAnnotationType[];
  check_needed: boolean;
  checklist: string[];
};

type nlpAnnotationType = {
  text: string;
  start: number;
  end: number;
  label: string;
  source: string;
};
