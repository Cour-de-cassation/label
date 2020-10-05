import { GraphQLObjectType } from 'graphql';
import { signUpUserGraphQLMutation } from '../modules/user';

export { graphQLMutation };

const graphQLMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    signUpUser: signUpUserGraphQLMutation,
  },
});
