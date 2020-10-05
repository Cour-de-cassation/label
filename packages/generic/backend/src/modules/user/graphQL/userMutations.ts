import { GraphQLString } from 'graphql';
import { successGraphQLType } from '../../../graphQL';
import { resolveSignUpUser } from './resolvers';

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
