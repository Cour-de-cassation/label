import { userModule, userType } from '@label/core';
import {
  buildAuthenticatedController,
  authorizationHeaderType,
} from './buildAuthenticatedController';

export { buildFakeAuthenticatedController };

function buildFakeAuthenticatedController<inT, outT>({
  permissions,
  controllerWithUser,
}: {
  permissions: Array<userType['role']>;
  controllerWithUser: (
    user: userType,
    req: { args: inT; headers: authorizationHeaderType },
  ) => Promise<outT>;
}): (req: { args: inT; headers: authorizationHeaderType }) => Promise<outT> {
  const authenticatedController = buildAuthenticatedController({
    permissions,
    controllerWithUser,
  });

  return async (req: { args: inT; headers: authorizationHeaderType }) => {
    try {
      return await authenticatedController(req);
    } catch (_error) {
      return controllerWithUser(userModule.generator.generate(), req);
    }
  };
}
