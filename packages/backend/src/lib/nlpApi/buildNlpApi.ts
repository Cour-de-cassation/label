import { httpRequester } from '../httpRequester';
import { nlpApiType } from './nlpApiType';

export { buildNlpApi };

function buildNlpApi(): nlpApiType {
  const NLP_API_BASE_URL = 'TO_BE_DEFINED';

  return {
    async fetchNlpEngineAnnotations(courtDecision) {
      const response = await httpRequester.request({
        data: { courtDecision },
        headers: {},
        method: 'post',
        url: `${NLP_API_BASE_URL}/ner`,
      });

      return response.data.text;
    },
  };
}
