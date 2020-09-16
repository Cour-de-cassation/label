import { dependencyManager } from '../../../utils';
import { fakeOracleApi } from './fakeOracleApi';
import { localStorageOracleApi } from './localStorageOracleApi';
import { oracleApi } from './oracleApi';
import { jurinetCourtDecisionType, oracleApiType } from './oracleApiType';

export { jurinetCourtDecisionType, oracleApiType, api as oracleApi };

const api = dependencyManager.inject({
  forLocal: localStorageOracleApi,
  forProd: oracleApi,
  forTest: fakeOracleApi,
});
