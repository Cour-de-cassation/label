import { documentType } from '@label/core';
import { labelTreatmentsType } from '@label/backend';

export type { sderApiType, sderCourtDecisionType };

type sderApiType = {
  fetchCourtDecisions: (days: number) => Promise<Array<sderCourtDecisionType>>;
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

type sderCourtDecisionType = {
  chamberId: string;
  chamberName: string;
  dateDecision: string;
  dateCreation: string;
  jurisdictionId: string;
  jurisdictionCode: string;
  jurisdictionName: string;
  originalText: string;
  registerNumber: string;
  sourceId: number;
  sourceName: string;
  zoning: {
    introduction_subzonage: {
      publication: string[] | null;
    } | null;
  } | null;
};
