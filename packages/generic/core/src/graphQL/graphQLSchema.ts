import { graphQLMutation } from "./graphQLMutation";
import { graphQLQuery } from "./graphQLQuery";
import { graphQLSchemaType } from "./graphQLSchemaType";

export { graphQLSchema };

const graphQLSchema = {
  mutation: graphQLMutation,
  query: graphQLQuery,
};

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: graphQLSchemaType = graphQLSchema;
