export type { jurinetCourtDecisionType, oracleApiType };

type oracleApiType = {
  fetchJurinetCourtDecisions: () => Promise<Array<jurinetCourtDecisionType>>;
};

type jurinetCourtDecisionType = {
  date: Date;
  metadata: string;
  oracleId: string;
  source: 'jurinet';
  xmlCourtDecision: string;
};
