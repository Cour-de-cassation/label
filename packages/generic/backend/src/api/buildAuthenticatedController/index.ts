import { dependencyManager } from '../../utils';
import { buildAuthenticatedController } from './buildAuthenticatedController';
import { buildFakeAuthenticatedController } from './buildFakeAuthenticatedController';

export { buildResolver as buildAuthenticatedController };

const buildResolver = dependencyManager.inject({
  forLocal: buildFakeAuthenticatedController,
  forProd: buildAuthenticatedController,
  forTest: buildFakeAuthenticatedController,
});
