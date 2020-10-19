import { idType } from '@label/core';
import { GraphQLFieldResolver } from 'graphql';
import { userService } from '../service';

export { buildAuthenticatedResolver };

type contextType = {
  headers: {
    authorization: string;
  };
};

function buildAuthenticatedResolver<T>(
  resolver: (userId: idType) => T,
): GraphQLFieldResolver<any, contextType> {
  return (_root: any, _args: any, context) => {
    const userId = userService.extractUserIdFromAuthorizationHeader(
      context.headers.authorization,
    );
    return resolver(userId);
  };
}
