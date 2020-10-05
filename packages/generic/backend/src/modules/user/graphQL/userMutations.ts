import { resolveSignUpUser } from './resolvers';
import { successGraphQLType } from '../../document';
import { GraphQLString } from 'graphql';

export { signUpUserGraphQLMutation };

const signUpUserGraphQLMutation = {
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
