import { idModule, userModule, userType } from '@label/core';
import { errorHandlers } from 'sder-core';

export { buildAuthenticatedController };

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
    const currentUser =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      req.session && req.session.user ? req.session.user : null;
    if (!currentUser) {
      throw errorHandlers.authenticationErrorHandler.build(
        `user session has expired or invalid`,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const dbUser = {
      ...currentUser,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      _id: idModule.lib.buildId(currentUser._id),
    };
    userModule.lib.assertPermissions(dbUser, permissions);
    return controllerWithUser(dbUser, req);
  };
}
