import { courtDecisionType } from '@label/core';

export { nlpApiType };

type nlpApiType = {
  fetchNlpEngineAnnotations: (
    courtDecision: courtDecisionType,
  ) => Promise<nlpEngineCourtDecisionAnnotationsType>;
};

type nlpEngineCourtDecisionAnnotationsType = {
  entities: nlpEngineAnnotationType[];
  check_needed: boolean;
  checklist: string[];
};

type nlpEngineAnnotationType = {
  text: string;
  start: number;
  end: number;
  label: string;
  source: string;
};
