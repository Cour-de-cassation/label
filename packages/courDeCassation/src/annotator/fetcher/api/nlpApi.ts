import axios from 'axios';
import { nlpApiType, nlpAnnotationsType } from './nlpApiType';

export { nlpApi };

const NLP_API_BASE_URL = 'http://10.16.64.7:8081';

const nlpApi: nlpApiType = {
  async fetchNlpAnnotations(settings, document) {
    const nlpRequestParameters = {
      idDocument: document.documentNumber,
      text: document.text,
      source: document.source,
      meta: document.metadata !== '' ? document.metadata : undefined,
      categories: Object.keys(settings),
    };

    const response = await axios({
      data: nlpRequestParameters,
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      url: `${NLP_API_BASE_URL}/ner`,
    });

    return response.data as nlpAnnotationsType;
  },
};
