import { nlpFakeServer } from '../../test/server';
import { nlpApiType } from './nlpApiType';

export { buildNlpFakeApi };

function buildNlpFakeApi(): nlpApiType {
  return {
    async fetchNlpAnnotations() {
      return nlpFakeServer.getNlpAnnotations();
    },
    async fetchNlpLoss() {
      return 0;
    },
  };
}
