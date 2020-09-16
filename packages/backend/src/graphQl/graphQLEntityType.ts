import { GraphQLObjectType, GraphQLFieldResolver } from 'graphql';

type graphQLEntityType = {
  name: string;
  resolve: GraphQLFieldResolver<any, any, any>;
  type: GraphQLObjectType<any, any>;
};

export { graphQLEntityType };
