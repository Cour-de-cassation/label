export type { jurinetApiType, jurinetCourtDecisionType };

type jurinetApiType = {
  fetchJurinetCourtDecisions: () => Promise<Array<jurinetCourtDecisionType>>;
};

type jurinetCourtDecisionType = {
  date: Date;
  metadata: string;
  oracleId: string;
  source: 'jurinet';
  xmlCourtDecision: string;
};
