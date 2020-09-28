import { GraphQLObjectType } from 'graphql';
import { insertUserMutation } from '../modules/user';

export { graphQLMutation };

const graphQLMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    insertUser: insertUserMutation,
  },
});
