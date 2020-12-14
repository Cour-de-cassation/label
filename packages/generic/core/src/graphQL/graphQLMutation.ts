import { documentModule, problemReportModule } from '../modules';
import { graphQLMutationType } from './graphQLTypes';

export { graphQLMutation };

const graphQLMutation = {
  annotations: {
    type: {
      kind: 'custom',
      type: 'success',
    },
    args: {
      documentId: {
        kind: 'primitive',
        type: 'id',
      },
      fetchedGraphQLAnnotations: {
        kind: 'list',
        type: {
          kind: 'custom',
          type: 'annotation',
        },
      },
    },
  },
  monitoringEntry: {
    type: {
      kind: 'custom',
      type: 'success',
    },
    args: {
      newMonitoringEntry: {
        kind: 'custom',
        type: 'monitoringEntry',
      },
    },
  },
  problemReport: {
    type: {
      kind: 'custom',
      type: 'success',
    },
    args: {
      documentId: {
        kind: 'primitive',
        type: 'id',
      },
      problemType: {
        kind: 'primitive',
        type: problemReportModule.dataModel.type.type,
      },
      problemText: {
        kind: 'primitive',
        type: 'string',
      },
    },
  },
  updateDocumentStatus: {
    type: {
      kind: 'custom',
      type: 'success',
    },
    args: {
      documentId: {
        kind: 'primitive',
        type: 'id',
      },
      status: {
        kind: 'primitive',
        type: documentModule.dataModel.status.type,
      },
    },
  },
  signUpUser: {
    type: {
      kind: 'custom',
      type: 'success',
    },
    args: {
      email: {
        kind: 'primitive',
        type: 'string',
      },
      password: {
        kind: 'primitive',
        type: 'string',
      },
    },
  },
  treatment: {
    type: {
      kind: 'custom',
      type: 'success',
    },
    args: {
      documentId: {
        kind: 'primitive',
        type: 'id',
      },
      fetchedGraphQLAnnotations: {
        kind: 'list',
        type: {
          kind: 'custom',
          type: 'annotation',
        },
      },
      duration: {
        kind: 'primitive',
        type: 'number',
      },
    },
  },
} as const;

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: graphQLMutationType = graphQLMutation;
