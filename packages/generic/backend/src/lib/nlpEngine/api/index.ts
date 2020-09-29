import { dependencyManager } from '../../../utils';
import { localStorageNlpEngineApi } from './localStorageNlpEngineApi';
import { nlpEngineApi } from './nlpEngineApi';
import { nlpEngineCourtDecisionAnnotationsType } from './nlpEngineApiType';

export type { nlpEngineCourtDecisionAnnotationsType };

export { api as nlpEngineApi };

const api = dependencyManager.inject({
  forLocal: localStorageNlpEngineApi,
  forProd: nlpEngineApi,
  forTest: localStorageNlpEngineApi,
});
