import { dependencyManager } from '@label/core';
import { sderApi } from './sderApi';
import { sderCourtDecisionType } from './sderApiType';
import { sderLocalApi } from './sderLocalApi';

export { api as sderApi }

export type { sderCourtDecisionType };

const api = dependencyManager.inject({
  forLocal: sderLocalApi,
  forProd: sderApi,
});
