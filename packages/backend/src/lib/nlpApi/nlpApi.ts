import { httpRequester } from '../httpRequester';
import { courtDecisionType } from '@label/core';

const NLP_API_BASE_URL = 'TO_BE_DEFINED';

const nlpApi = {
  async fetchNlpEngineAnnotation(
    courtDecision: courtDecisionType,
  ): Promise<object> {
    const response = await httpRequester.request({
      data: { courtDecision },
      headers: {},
      method: 'post',
      url: `${NLP_API_BASE_URL}/ner`,
    });

    return response.data.text;
  },
};

export { nlpApi };
