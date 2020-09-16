import { GraphQLString } from 'graphql';
import { successGraphQLType } from '../../courtDecision';
import { resolveLogin } from './resolvers/resolveLogin';

export { loginQuery };

const loginQuery = {
  resolve: resolveLogin,
  type: successGraphQLType,
  args: {
    email: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
  },
};
