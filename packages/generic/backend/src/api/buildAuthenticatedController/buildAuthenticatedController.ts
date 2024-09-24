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
    req: { args: inT; headers: any; session?: any; path?: string },
  ) => Promise<outT>;
}): (req: {
  args: inT;
  headers: any;
  session?: any;
  path?: string;
}) => Promise<outT> {
  return async (req: {
    args: inT;
    headers: any;
    session?: any;
    path?: string;
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    let currentUser = req.session?.user ?? null;
    // eslint-disable-next-line no-console
    console.log(`path ${req.path}`);
    if (!currentUser) {
      throw errorHandlers.authenticationErrorHandler.build(
        `user session has expired or is invalid`,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const isAnnotator = currentUser.role === 'annotator';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const isAdminAccessingDocs =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      currentUser.role === 'admin' && req.path?.includes('documentsForUser');

    if (isAnnotator || isAdminAccessingDocs) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      currentUser = {
        ...currentUser,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        _id: idModule.lib.buildId(currentUser._id),
      };
    }
    userModule.lib.assertPermissions(currentUser, permissions);
    return controllerWithUser(currentUser, req);
  };
}
