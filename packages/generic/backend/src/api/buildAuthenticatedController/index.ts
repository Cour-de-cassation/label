import { dependencyManager } from '@label/core';
import { buildAuthenticatedController } from './buildAuthenticatedController';
import { buildFakeAuthenticatedController } from './buildFakeAuthenticatedController';

export { buildController as buildAuthenticatedController };

const buildController = dependencyManager.inject({
  forLocal: buildFakeAuthenticatedController,
  forProd: buildAuthenticatedController,
  forTest: buildFakeAuthenticatedController,
});
