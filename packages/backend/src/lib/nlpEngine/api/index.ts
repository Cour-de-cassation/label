import { dependencyManager } from '../../../utils';
import { localStorageNlpEngineApi } from './localStorageNlpEngineApi';
import { nlpEngineApi } from './nlpEngineApi';
import { nlpEngineCourtDecisionAnnotationsType } from './nlpEngineApiType';

export { api as nlpEngineApi, nlpEngineCourtDecisionAnnotationsType };

const api = dependencyManager.inject({
  forLocal: localStorageNlpEngineApi,
  forProd: nlpEngineApi,
  forTest: localStorageNlpEngineApi,
});
