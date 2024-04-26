import { dependencyManager } from '@label/backend';
import { buildNlpApi } from './nlpApi';
import { buildNlpFakeApi } from './nlpFakeApi';
import { buildNlpLocalApi } from './nlpLocalApi';
import { nlpResponseType } from './nlpApiType';

export { buildApi as buildNlpApi };

export type { nlpResponseType };

const buildApi = dependencyManager.inject({
  forLocal:
    process.env.NLP_PSEUDONYMISATION_API_ENABLED === 'true'
      ? buildNlpApi
      : buildNlpLocalApi,
  forProd: buildNlpApi,
  forTest: buildNlpFakeApi,
});
