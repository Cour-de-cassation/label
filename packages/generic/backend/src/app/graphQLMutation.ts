import { GraphQLObjectType } from 'graphql';
import { annotationsGraphQLMutation } from '../modules/annotation';
import { signUpUserGraphQLMutation } from '../modules/user';

export { graphQLMutation };

const graphQLMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    annotations: annotationsGraphQLMutation,
    signUpUser: signUpUserGraphQLMutation,
  },
});
