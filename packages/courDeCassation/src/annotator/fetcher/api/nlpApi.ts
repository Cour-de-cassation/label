import axios from 'axios';
import { nlpApiType, nlpAnnotationsType } from './nlpApiType';

export { nlpApi };

const NLP_API_BASE_URL = 'http://127.0.0.1:8081';

const nlpApi: nlpApiType = {
  async fetchNlpAnnotations(document) {
    const nlpRequestParameters = {
      idDocument: document.documentId,
      text: document.text,
      source: document.source,
      meta: document.metadata !== '' ? document.metadata : undefined,
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
