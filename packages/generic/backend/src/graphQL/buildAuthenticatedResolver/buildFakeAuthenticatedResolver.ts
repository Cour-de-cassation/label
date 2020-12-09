import { idModule, idType } from '@label/core';
import { userService } from '../../modules/user';

export { buildFakeAuthenticatedResolver };

type contextType = {
  headers: {
    authorization: string;
  };
};

function buildFakeAuthenticatedResolver<argT, T>(
  resolver: (userId: idType, args: argT) => T,
): (_root: unknown, args: argT, context: unknown) => T {
  return (_root: unknown, args: argT, context) => {
    let userId;
    try {
      userId = userService.extractUserIdFromAuthorizationHeader(
        (context as contextType).headers.authorization,
      );
    } catch (_error) {
      userId = idModule.lib.buildId();
    }

    return resolver(userId, args);
  };
}
