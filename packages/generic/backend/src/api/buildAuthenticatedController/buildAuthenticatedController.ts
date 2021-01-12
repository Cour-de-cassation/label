import { userModule, userType } from '@label/core';
import { userService } from '../../modules/user';

export { buildAuthenticatedController };

export type { authorizationHeaderType };

type authorizationHeaderType = {
  authorization: string;
};

function buildAuthenticatedController<inT, outT>({
  permissions,
  controllerWithUser,
}: {
  permissions: Array<userType['role']>;
  controllerWithUser: (
    user: userType,
    req: { args: inT; headers: authorizationHeaderType },
  ) => Promise<outT>;
}): (req: { args: inT; headers: authorizationHeaderType }) => Promise<outT> {
  return async (req: { args: inT; headers: authorizationHeaderType }) => {
    const user = await userService.fetchAuthenticatedUserFromAuthorizationHeader(
      req.headers.authorization,
    );
    userModule.lib.assertPermissions(user, permissions);

    return controllerWithUser(user, req);
  };
}
