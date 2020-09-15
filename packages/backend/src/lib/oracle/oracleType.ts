export { oracleType };

type oracleType = {
  fetchJurinetCourtDecisions: () => Promise<string[]>;
};
