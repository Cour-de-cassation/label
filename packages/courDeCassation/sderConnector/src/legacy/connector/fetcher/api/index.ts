import { dependencyManager } from '@label/core';
import { jurinetApi } from './jurinetApi';
import { jurinetCourtDecisionType } from './jurinetApiType';
import { jurinetFakeApi } from './jurinetFakeApi';
import { jurinetLocalApi } from './jurinetLocalApi';

export { api as jurinetApi }

export type { jurinetCourtDecisionType };

const api = dependencyManager.inject({
  forLocal: jurinetLocalApi,
  forProd: jurinetApi,
  forTest: jurinetFakeApi,
});


