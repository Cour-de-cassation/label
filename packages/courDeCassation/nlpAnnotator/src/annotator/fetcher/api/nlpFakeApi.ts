import { nlpFakeServer } from '../../test/server';
import { nlpApiType } from './nlpApiType';

export { nlpFakeApi };

const nlpFakeApi: nlpApiType = {
  async fetchNlpAnnotations() {
    return nlpFakeServer.getNlpAnnotations();
  },
};
