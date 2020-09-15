export { oracleType };

type oracleType = {
  fetchJurinetCourtDecisions: () => Promise<
    Array<{
      date: Date;
      metadata: string;
      oracleId: string;
      source: 'jurinet';
      xmlCourtDecision: string;
    }>
  >;
};
