import { idType } from '@label/core';
import { userService } from '../modules/user';

export { buildAuthenticatedResolver };

type contextType = {
  headers: {
    authorization: string;
  };
};

function buildAuthenticatedResolver<argT, T>(
  resolver: (userId: idType, args: argT) => T,
): (_root: unknown, args: argT, context: unknown) => T {
  return (_root: unknown, args: argT, context) => {
    const userId = userService.extractUserIdFromAuthorizationHeader(
      (context as contextType).headers.authorization,
    );
    return resolver(userId, args);
  };
}
