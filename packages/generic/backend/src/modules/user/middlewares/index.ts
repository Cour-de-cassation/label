import { authenticationMiddleware } from './authenticationMiddleware';
import { fakeAuthenticationMiddleware } from './fakeAuthenticationMiddleware';
import { dependencyManager } from '../../../utils';

export { middleware as authenticationMiddleware };

const middleware = dependencyManager.inject({
  forLocal: fakeAuthenticationMiddleware,
  forProd: authenticationMiddleware,
  forTest: authenticationMiddleware,
});
