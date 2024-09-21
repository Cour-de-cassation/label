import { userModule, userType } from '@label/core';
import { errorHandlers } from 'sder-core';

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
    req: { args: inT; headers: any; session?: any },
  ) => Promise<outT>;
}): (req: { args: inT; headers: any; session?: any }) => Promise<outT> {
  return async (req: { args: inT; headers: any; session?: any }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const user =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      req.session && req.session.user ? req.session.user : null;
    if (!user) {
      throw errorHandlers.authenticationErrorHandler.build(
        `user session has expired or invalid`,
      );
    }
    userModule.lib.assertPermissions(user, permissions);
    return controllerWithUser(user, req);
  };
}
