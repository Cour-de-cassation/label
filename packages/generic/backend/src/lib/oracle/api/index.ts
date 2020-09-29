import { dependencyManager } from '../../../utils';
import { fakeOracleApi } from './fakeOracleApi';
import { localStorageOracleApi } from './localStorageOracleApi';
import { oracleApi } from './oracleApi';
import { jurinetCourtDecisionType, oracleApiType } from './oracleApiType';

export { api as oracleApi };

export type { jurinetCourtDecisionType, oracleApiType };

const api = dependencyManager.inject({
  forLocal: localStorageOracleApi,
  forProd: oracleApi,
  forTest: fakeOracleApi,
});
