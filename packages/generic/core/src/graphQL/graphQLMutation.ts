import { graphQLMutationType } from "./graphQLTypes";

export { graphQLMutation };

const graphQLMutation = {
  annotations: {
    type: {
      kind: "custom",
      type: "success",
    },
    args: {
      documentIdString: {
        kind: "primitive",
        type: "string",
      },
      fetchedGraphQLAnnotations: {
        kind: "list",
        type: {
          kind: "custom",
          type: "annotation",
        },
      },
    },
  },
  updateAssignationStatus: {
    type: {
      kind: "custom",
      type: "success",
    },
    args: {
      documentIdString: {
        kind: "primitive",
        type: "string",
      },
      statusString: {
        kind: "primitive",
        type: "string",
      },
    },
  },
  signUpUser: {
    type: {
      kind: "custom",
      type: "success",
    },
    args: {
      email: {
        kind: "primitive",
        type: "string",
      },
      password: {
        kind: "primitive",
        type: "string",
      },
    },
  },
} as const;

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: graphQLMutationType = graphQLMutation;
