import { graphQLQueryType } from "./graphQLSchemaType";

export { graphQLQuery };

const graphQLQuery = {
  annotations: {
    type: {
      kind: "list",
      type: {
        kind: "custom",
        type: "annotation",
      },
    },
    args: {
      documentId: {
        kind: "primitive",
        type: "string",
      },
    },
  },
  document: {
    type: {
      kind: "custom",
      type: "document",
    },
  },
  settings: {
    type: {
      kind: "custom",
      type: "settings",
    },
  },
} as const;

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: graphQLQueryType = graphQLQuery;
