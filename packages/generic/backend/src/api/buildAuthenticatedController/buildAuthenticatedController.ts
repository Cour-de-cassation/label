import { idModule, userModule, userType } from '@label/core';

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
    session?: {
      user: {
        _id: string;
        name: string;
        role: string;
        email: string;
        sessionIndex: string;
      };
    };
    path?: string;
  }) => {
    const currentUser = req.session?.user ?? null;
    if (!currentUser) {
      throw new Error(`user session has expired or is invalid`);
    }

    const resolvedUser = {
      _id: idModule.lib.buildId(currentUser._id) as userType['_id'],
      name: currentUser.name,
      role: currentUser.role as
        | 'admin'
        | 'annotator'
        | 'publicator'
        | 'scrutator',
      email: currentUser.email,
    };

    userModule.lib.assertPermissions(resolvedUser, permissions);
    return controllerWithUser(resolvedUser, req);
  };
}
