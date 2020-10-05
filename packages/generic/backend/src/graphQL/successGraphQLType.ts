import { GraphQLObjectType, GraphQLBoolean } from 'graphql';

export { successGraphQLType };

const successGraphQLType = new GraphQLObjectType({
  name: 'success',
  fields: {
    success: {
      type: GraphQLBoolean,
    },
  },
});
