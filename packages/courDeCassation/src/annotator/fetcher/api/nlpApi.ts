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
      meta: document.metadata,
    };

    console.log('NLP_API_BASE_URL', NLP_API_BASE_URL);
    console.log('nlpRequestParameters', nlpRequestParameters);

    const response = await axios({
      data: nlpRequestParameters,
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      url: `${NLP_API_BASE_URL}/ner`,
    });

    console.log('response', response);

    return response.data as nlpAnnotationsType;
  },
};
