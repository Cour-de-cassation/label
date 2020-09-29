import { jurinetFakeServer } from '../../test/server';
import { jurinetApiType } from './jurinetApiType';

export { jurinetFakeApi };

const jurinetFakeApi: jurinetApiType = {
  async fetchJurinetCourtDecisions() {
    return jurinetFakeServer.getJurinetCourtDecisions();
  },
};
