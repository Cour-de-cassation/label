export type { sderApiType, sderCourtDecisionType };

type sderApiType = {
  fetchCourtDecisions: () => Promise<Array<sderCourtDecisionType>>;
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
  sourceId: string;
  sourceName: string;
};
