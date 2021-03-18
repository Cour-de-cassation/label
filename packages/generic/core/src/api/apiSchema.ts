import {
  annotationModule,
  annotationsDiffModule,
  buildDataModelEntry,
  dataModelEntryType,
  documentModule,
  problemReportModule,
} from '../modules';
import { fetchedDataModelEntries } from './fetchedDataModelEntries';

export { apiSchema };

export type { apiSchemaType, apiSchemaMethodNameType, apiSchemaMethodType, apiSchemaEntryType };

const apiSchema = {
  get: {
    annotationReport: {
      in: {
        documentId: buildDataModelEntry({
          kind: 'primitive',
          content: 'string',
        }),
      },
      out: fetchedDataModelEntries.annotationReport,
    },
    annotations: {
      in: {
        documentId: buildDataModelEntry({
          kind: 'primitive',
          content: 'string',
        }),
      },
      out: buildDataModelEntry({
        kind: 'list',
        content: annotationModule.dataModelField,
      }),
    },
    document: {
      in: {
        documentId: buildDataModelEntry({
          kind: 'primitive',
          content: 'string',
        }),
      },
      out: fetchedDataModelEntries.document,
    },
    documentForUser: {
      in: {
        documentIdsToExclude: buildDataModelEntry({
          kind: 'list',
          content: {
            kind: 'primitive',
            content: 'id',
          },
        }),
      },
      out: fetchedDataModelEntries.document,
    },
    problemReportsWithDetails: {
      out: buildDataModelEntry({
        kind: 'list',
        content: {
          kind: 'object',
          content: {
            problemReport: fetchedDataModelEntries.problemReport,
            documentId: { kind: 'primitive', content: 'id' },
            userName: {
              kind: 'primitive',
              content: 'string',
            },
          },
        },
      }),
    },
    settings: {
      out: fetchedDataModelEntries.settings,
    },
    treatedDocuments: {
      out: buildDataModelEntry({
        kind: 'list',
        content: {
          kind: 'object',
          content: {
            document: {
              kind: 'object',
              content: {
                _id: fetchedDataModelEntries.document.content._id,
                documentId: fetchedDataModelEntries.document.content.documentId,
                publicationCategory: fetchedDataModelEntries.document.content.publicationCategory,
              },
            },
            treatments: {
              kind: 'list',
              content: fetchedDataModelEntries.treatment,
            },
            userName: {
              kind: 'primitive',
              content: 'string',
            },
          },
        },
      }),
    },
    untreatedDocuments: {
      out: buildDataModelEntry({
        kind: 'list',
        content: fetchedDataModelEntries.document,
      }),
    },
    usersWithDetails: {
      out: buildDataModelEntry({
        kind: 'list',
        content: {
          kind: 'object',
          content: {
            user: {
              kind: 'object',
              content: {
                _id: fetchedDataModelEntries.user.content._id,
                email: fetchedDataModelEntries.user.content.email,
                name: fetchedDataModelEntries.user.content.name,
                role: fetchedDataModelEntries.user.content.role,
              },
            },
          },
        },
      }),
    },
  },
  post: {
    changePassword: {
      in: {
        previousPassword: { kind: 'primitive', content: 'string' },
        newPassword: { kind: 'primitive', content: 'string' },
      },
      out: { kind: 'constant', content: ['notValidNewPassword', 'passwordUpdated', 'wrongPassword'] as const },
    },
    createUser: {
      in: {
        name: {
          kind: 'primitive',
          content: 'string',
        },
        email: {
          kind: 'primitive',
          content: 'string',
        },
        role: {
          kind: 'constant',
          content: ['admin', 'annotator'] as const,
        },
      },
      out: { kind: 'primitive', content: 'string' },
    },
    login: {
      in: {
        email: {
          kind: 'primitive',
          content: 'string',
        },
        password: {
          kind: 'primitive',
          content: 'string',
        },
      },
      out: {
        kind: 'object',
        content: {
          email: { kind: 'primitive', content: 'string' },
          name: { kind: 'primitive', content: 'string' },
          role: { kind: 'constant', content: ['admin', 'annotator'] as const },
          token: { kind: 'primitive', content: 'string' },
        },
      },
    },
    monitoringEntries: {
      in: {
        newMonitoringEntries: buildDataModelEntry({
          kind: 'list',
          content: fetchedDataModelEntries.monitoringEntry,
        }),
      },
      out: {
        kind: 'primitive',
        content: 'void',
      },
    },
    problemReport: {
      in: {
        documentId: buildDataModelEntry({
          kind: 'primitive',
          content: 'id',
        }),
        problemType: problemReportModule.dataModel.type.type,
        problemText: buildDataModelEntry({
          kind: 'primitive',
          content: 'string',
        }),
      },
      out: {
        kind: 'primitive',
        content: 'void',
      },
    },
    updateAssignationDocumentStatus: {
      in: {
        assignationId: buildDataModelEntry({
          kind: 'primitive',
          content: 'id',
        }),
        status: documentModule.dataModel.status.type,
      },
      out: {
        kind: 'primitive',
        content: 'void',
      },
    },
    updateDocumentStatus: {
      in: {
        documentId: buildDataModelEntry({
          kind: 'primitive',
          content: 'id',
        }),
        status: documentModule.dataModel.status.type,
      },
      out: {
        kind: 'primitive',
        content: 'void',
      },
    },
    updateTreatment: {
      in: {
        annotationsDiff: annotationsDiffModule.dataModelField,
        documentId: buildDataModelEntry({
          kind: 'primitive',
          content: 'id',
        }),
      },
      out: {
        kind: 'primitive',
        content: 'void',
      },
    },
  },
} as const;

type apiSchemaType = {
  get: apiSchemaMethodType;
  post: apiSchemaMethodType;
};

type apiSchemaMethodNameType = keyof apiSchemaType;

type apiSchemaMethodType = { [key: string]: apiSchemaEntryType };

type apiSchemaEntryType = { in?: { [param: string]: dataModelEntryType }; out: dataModelEntryType };

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: apiSchemaType = apiSchema;
