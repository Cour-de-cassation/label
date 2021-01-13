import { buildDataModelEntry, dataModelEntryType, documentModule, problemReportModule } from '../modules';
import { fetchedDataModelEntries } from './fetchedDataModelEntries';

export { apiSchema };

export type { apiSchemaType, apiSchemaMethodNameType, apiSchemaMethodType, apiSchemaEntryType };

const apiSchema = {
  get: {
    annotations: {
      in: {
        documentId: buildDataModelEntry({
          kind: 'primitive',
          content: 'string',
        }),
      },
      out: buildDataModelEntry({
        kind: 'list',
        content: fetchedDataModelEntries.annotation,
      }),
    },
    document: {
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
    problemReports: {
      out: buildDataModelEntry({
        kind: 'list',
        content: fetchedDataModelEntries.problemReport,
      }),
    },
    settings: {
      out: fetchedDataModelEntries.settings,
    },
    treatments: {
      out: buildDataModelEntry({
        kind: 'list',
        content: fetchedDataModelEntries.treatment,
      }),
    },
  },
  post: {
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
        kind: 'primitive',
        content: 'string',
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
    signUpUser: {
      in: {
        email: buildDataModelEntry({
          kind: 'primitive',
          content: 'string',
        }),
        password: buildDataModelEntry({
          kind: 'primitive',
          content: 'string',
        }),
      },
      out: {
        kind: 'primitive',
        content: 'void',
      },
    },
    createTreatment: {
      in: {
        documentId: buildDataModelEntry({
          kind: 'primitive',
          content: 'id',
        }),
        fetchedGraphQLAnnotations: buildDataModelEntry({
          kind: 'list',
          content: fetchedDataModelEntries.annotation,
        }),
        duration: buildDataModelEntry({
          kind: 'primitive',
          content: 'number',
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
  [methodName in apiSchemaMethodNameType]: apiSchemaMethodType;
};

type apiSchemaMethodNameType = 'get' | 'post';

type apiSchemaMethodType = { [key: string]: apiSchemaEntryType };

type apiSchemaEntryType = { in?: { [param: string]: dataModelEntryType }; out: dataModelEntryType };

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: apiSchemaType = apiSchema;
