import { GraphQLObjectType } from "graphql";
import { insertUserMutation } from "../modules/user";

const graphQLMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    insertUser: insertUserMutation,
  },
});

export { graphQLMutation };
