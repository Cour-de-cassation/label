import { assertPermissions } from './assertPermissions';
import { authenticator } from './authenticator';
import { buildUser } from './buildUser';

const userLib = {
  assertAuthorization: authenticator.assertAuthorization,
  assertPermissions,
  buildUser,
  extractUserIdFromAuthorizationHeader: authenticator.extractUserIdFromAuthorizationHeader,
  formatEmail: authenticator.formatEmail,
};

export { userLib };
