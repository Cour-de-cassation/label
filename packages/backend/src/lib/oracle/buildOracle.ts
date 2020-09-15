import { oracleType } from './oracleType';

export { buildOracle };

function buildOracle(): oracleType {
  return {
    async fetchJurinetCourtDecisions() {
      return [];
    },
  };
}
