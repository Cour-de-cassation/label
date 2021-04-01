import { decisionType } from 'sder';
import { documentType } from '@label/core';
import { labelTreatmentsType } from '@label/backend';

export type { sderApiType };

type sderApiType = {
  fetchCourtDecisions: (days: number) => Promise<Array<decisionType>>;
  setCourtDecisionsLoaded: (documents: Array<documentType>) => Promise<void>;
  setCourtDecisionDone: (
    documentId: documentType['documentId'],
  ) => Promise<void>;
  updateDecisionPseudonymisation: (param: {
    documentId: documentType['documentId'];
    pseudonymizationText: string;
    labelTreatments: labelTreatmentsType;
  }) => Promise<void>;
};
