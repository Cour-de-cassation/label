import { GraphQLObjectType } from "graphql";

type GraphQLEntityType = {
  name: string;
  resolve: (...args: any[]) => any;
  type: GraphQLObjectType<any, any>;
};

export { GraphQLEntityType };
