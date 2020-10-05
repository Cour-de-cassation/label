import { GraphQLObjectType, GraphQLFieldResolver } from 'graphql';

export type { graphQLEntityType };

type graphQLEntityType = {
  name: string;
  resolve: GraphQLFieldResolver<any, any, any>;
  type: GraphQLObjectType<any, any>;
};
