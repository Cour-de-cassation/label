import { dependencyManager } from '../../utils';
import { buildAuthenticatedResolver } from './buildAuthenticatedResolver';
import { buildFakeAuthenticatedResolver } from './buildFakeAuthenticatedResolver';

export { buildResolver as buildAuthenticatedResolver };

const buildResolver = dependencyManager.inject({
  forLocal: buildFakeAuthenticatedResolver,
  forProd: buildAuthenticatedResolver,
  forTest: buildFakeAuthenticatedResolver,
});
