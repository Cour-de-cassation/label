import { resolveSignUpUser } from './resolvers';
import { successGraphQLType } from '../../document';
import { GraphQLString } from 'graphql';

export { signUpUserMutation };

const signUpUserMutation = {
  resolve: resolveSignUpUser,
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
