import { userModule, userType } from '@label/core';
import { buildAuthenticatedResolver } from './buildAuthenticatedResolver';

export { buildFakeAuthenticatedResolver };

function buildFakeAuthenticatedResolver<argT, T>({
  permissions,
  resolver,
}: {
  permissions: Array<userType['role']>;
  resolver: (user: userType, args: argT) => Promise<T>;
}): (_root: unknown, args: argT, context: unknown) => Promise<T> {
  const authenticatedResolver = buildAuthenticatedResolver({
    permissions,
    resolver,
  });

  return async (_root: unknown, args: argT, context) => {
    try {
      return await authenticatedResolver(_root, args, context);
    } catch (_error) {
      return resolver(userModule.generator.generate(), args);
    }
  };
}
