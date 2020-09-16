import { GraphQLObjectType } from 'graphql';

type graphQLEntityType = {
  name: string;
  resolve: (...args: any[]) => any;
  type: GraphQLObjectType<any, any>;
};

export { graphQLEntityType };
