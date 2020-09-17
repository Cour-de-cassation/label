import { GraphQLObjectType, GraphQLString } from 'graphql';

export const tokenGraphQLType = new GraphQLObjectType({
  name: 'token',
  fields: {
    token: {
      type: GraphQLString,
    },
  },
});
