import { httpRequester } from '@label/core';
import { nlpApiType, nlpAnnotationsType } from './nlpApiType';

export { nlpApi };

const NLP_API_BASE_URL = 'http://127.0.0.1:8081';

const nlpApi: nlpApiType = {
  async fetchNlpAnnotations(settings, document) {
    const nlpRequestParameters = {
      idDocument: document.documentId,
      text: document.text,
      source: document.source,
      meta: document.metadata !== '' ? document.metadata : undefined,
      categories: Object.keys(settings),
    };

    const response = await httpRequester.post(
      `${NLP_API_BASE_URL}/ner`,
      nlpRequestParameters,
    );

    return response as nlpAnnotationsType;
  },
};
