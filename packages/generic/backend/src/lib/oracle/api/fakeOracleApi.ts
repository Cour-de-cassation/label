import { oracleTestServer } from '../test';
import { oracleApiType } from './oracleApiType';

export { fakeOracleApi };

const fakeOracleApi: oracleApiType = {
  async fetchJurinetCourtDecisions() {
    return oracleTestServer.getJurinetCourtDecisions();
  },
};
