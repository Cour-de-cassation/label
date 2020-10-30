import { assignationModule, problemReportModule } from "../modules";
import { graphQLMutationType } from "./graphQLTypes";

export { graphQLMutation };

const graphQLMutation = {
  annotations: {
    type: {
      kind: "custom",
      type: "success",
    },
    args: {
      documentId: {
        kind: "primitive",
        type: "id",
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
  problemReport: {
    type: {
      kind: "custom",
      type: "success",
    },
    args: {
      documentId: {
        kind: "primitive",
        type: "id",
      },
      problemType: {
        kind: "primitive",
        type: problemReportModule.dataModel.type.type,
      },
      problemText: {
        kind: "primitive",
        type: "string",
      },
      isBlocking: {
        kind: "primitive",
        type: "boolean",
      },
    },
  },
  updateAssignationStatus: {
    type: {
      kind: "custom",
      type: "success",
    },
    args: {
      documentId: {
        kind: "primitive",
        type: "id",
      },
      status: {
        kind: "primitive",
        type: assignationModule.dataModel.status.type,
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
