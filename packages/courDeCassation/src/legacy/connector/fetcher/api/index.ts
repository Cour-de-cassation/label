import { dependencyManager } from '@label/core';
import { jurinetCourtDecisionType } from './jurinetApiType';
import { jurinetFakeApi } from './jurinetFakeApi';
import { jurinetLocalApi } from './jurinetLocalApi';

export { api as jurinetApi }

export type { jurinetCourtDecisionType };

const api = dependencyManager.inject({
  forLocal: jurinetLocalApi,
  forProd: jurinetLocalApi,
  forTest: jurinetFakeApi,
});


