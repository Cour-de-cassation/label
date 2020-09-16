import { resolveInsertUser } from './resolvers';
import { successGraphQLType } from '../../courtDecision';
import { GraphQLString } from 'graphql';

export { insertUserMutation };

const insertUserMutation = {
  resolve: resolveInsertUser,
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
