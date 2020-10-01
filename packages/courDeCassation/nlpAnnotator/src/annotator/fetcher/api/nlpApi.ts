import { httpRequester } from '@label/core';
import { nlpApiType, nlpAnnotationsType } from './nlpApiType';

export { nlpApi };

const NLP_API_BASE_URL = 'TO_BE_DEFINED';

const nlpApi: nlpApiType = {
  async fetchNlpAnnotations(document) {
    const response = await httpRequester.request({
      data: { document },
      headers: {},
      method: 'post',
      url: `${NLP_API_BASE_URL}/ner`,
    });

    return response.data as nlpAnnotationsType;
  },
};
