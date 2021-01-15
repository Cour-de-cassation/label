import { dependencyManager } from '@label/core';
import { nlpApi } from './nlpApi';
import { nlpFakeApi } from './nlpFakeApi';
import { nlpLocalApi } from './nlpLocalApi';
import { nlpAnnotationsType } from './nlpApiType';

export { api as nlpApi };

export type { nlpAnnotationsType };

const api = dependencyManager.inject({
  forLocal: nlpLocalApi,
  forProd: nlpApi,
  forTest: nlpFakeApi,
});
