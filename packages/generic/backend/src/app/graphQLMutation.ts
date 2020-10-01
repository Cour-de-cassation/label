import { GraphQLObjectType } from 'graphql';
import { signUpUserMutation } from '../modules/user';

export { graphQLMutation };

const graphQLMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    signUpUser: signUpUserMutation,
  },
});
