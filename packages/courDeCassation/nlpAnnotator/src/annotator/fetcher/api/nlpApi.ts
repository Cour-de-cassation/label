import { httpRequester } from '@label/core';
import { nlpApiType, nlpAnnotationsType } from './nlpApiType';

export { nlpApi };

const NLP_API_BASE_URL = 'http://bkpanonym:8080';

const nlpApi: nlpApiType = {
  async fetchNlpAnnotations(document) {
    const nlpRequestParameters = {
      idDocument: document.documentId,
      text: document.text,
      source: document.source,
      meta: document.metadata,
    };

    const response = await httpRequester.request({
      data: nlpRequestParameters,
      headers: {},
      method: 'post',
      url: `${NLP_API_BASE_URL}/ner`,
    });

    return response.data as nlpAnnotationsType;
  },
};
