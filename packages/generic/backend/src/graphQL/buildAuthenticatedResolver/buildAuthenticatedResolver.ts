import { userModule, userType } from '@label/core';
import { userService } from '../../modules/user';

export { buildAuthenticatedResolver };

export type { authorizationHeaderContextType };

type authorizationHeaderContextType = {
  headers: {
    authorization: string;
  };
};

function buildAuthenticatedResolver<argT, T>({
  permissions,
  resolver,
}: {
  permissions: Array<userType['role']>;
  resolver: (user: userType, args: argT) => Promise<T>;
}): (_root: unknown, args: argT, context: unknown) => Promise<T> {
  return async (_root: unknown, args: argT, context) => {
    const user = await userService.fetchAuthenticatedUserFromAuthorizationHeader(
      (context as authorizationHeaderContextType).headers.authorization,
    );
    userModule.lib.assertPermissions(user, permissions);

    return resolver(user, args);
  };
}
