import {
  annotationModule,
  annotationsDiffModule,
  annotationReportModule,
  documentModule,
  monitoringEntryModule,
  problemReportModule,
  settingsModule,
  treatmentModule,
  userModule,
  statisticModule,
} from '../modules';
import { buildModel, modelType } from '../modules/modelType';

export { apiSchema };

export type { apiSchemaType, apiSchemaMethodNameType, apiSchemaMethodType, apiSchemaEntryType };

const apiSchema = {
  get: {
    annotationReport: {
      in: {
        documentId: buildModel({
          kind: 'primitive',
          content: 'string',
        } as const),
      },
      out: annotationReportModule.model,
    },
    annotations: {
      in: {
        documentId: buildModel({
          kind: 'primitive',
          content: 'string',
        } as const),
      },
      out: buildModel({
        kind: 'array',
        content: annotationModule.model,
      } as const),
    },
    anonymizedDocumentText: {
      in: {
        documentId: buildModel({
          kind: 'primitive',
          content: 'string',
        } as const),
      },
      out: buildModel({
        kind: 'primitive',
        content: 'string',
      } as const),
    },
    document: {
      in: {
        documentId: buildModel({
          kind: 'primitive',
          content: 'string',
        } as const),
      },
      out: documentModule.fetchedModel,
    },
    documentForUser: {
      in: {
        documentIdsToExclude: buildModel({
          kind: 'array',
          content: {
            kind: 'custom',
            content: 'id',
          },
        } as const),
      },
      out: documentModule.fetchedModel,
    },
    problemReportsWithDetails: {
      out: buildModel({
        kind: 'array',
        content: {
          kind: 'object',
          content: {
            problemReport: problemReportModule.model,
            document: {
              kind: 'object',
              content: {
                _id: documentModule.fetchedModel.content._id,
                documentNumber: documentModule.fetchedModel.content.documentNumber,
                status: documentModule.fetchedModel.content.status,
              },
            },
            user: {
              kind: 'object',
              content: {
                email: userModule.model.content.email,
                name: userModule.model.content.name,
              },
            },
          },
        },
      } as const),
    },
    settings: {
      out: settingsModule.model,
    },
    specialDocuments: {
      out: buildModel({
        kind: 'array',
        content: documentModule.fetchedModel,
      } as const),
    },
    statistics: {
      out: buildModel({ kind: 'array', content: statisticModule.model } as const),
    },
    treatedDocuments: {
      out: buildModel({
        kind: 'array',
        content: {
          kind: 'object',
          content: {
            document: {
              kind: 'object',
              content: {
                _id: documentModule.fetchedModel.content._id,
                documentNumber: documentModule.fetchedModel.content.documentNumber,
                publicationCategory: documentModule.fetchedModel.content.publicationCategory,
              },
            },
            treatments: {
              kind: 'array',
              content: {
                kind: 'object',
                content: {
                  _id: treatmentModule.model.content._id,
                  addedAnnotationsCount: treatmentModule.model.content.addedAnnotationsCount,
                  deletedAnnotationsCount: treatmentModule.model.content.deletedAnnotationsCount,
                  documentId: treatmentModule.model.content.documentId,
                  duration: treatmentModule.model.content.duration,
                  lastUpdateDate: treatmentModule.model.content.lastUpdateDate,
                  modifiedAnnotationsCount: treatmentModule.model.content.modifiedAnnotationsCount,
                  resizedBiggerAnnotationsCount: treatmentModule.model.content.resizedBiggerAnnotationsCount,
                  resizedSmallerAnnotationsCount: treatmentModule.model.content.resizedSmallerAnnotationsCount,
                  source: treatmentModule.model.content.source,
                },
              },
            },
            userName: {
              kind: 'primitive',
              content: 'string',
            },
          },
        },
      } as const),
    },
    untreatedDocuments: {
      out: buildModel({
        kind: 'array',
        content: {
          kind: 'object',
          content: {
            _id: documentModule.model.content._id,
            documentNumber: documentModule.model.content.documentNumber,
            publicationCategory: documentModule.model.content.publicationCategory,
          },
        },
      } as const),
    },
    usersWithDetails: {
      out: buildModel({
        kind: 'array',
        content: {
          kind: 'object',
          content: {
            user: {
              kind: 'object',
              content: {
                _id: userModule.model.content._id,
                email: userModule.model.content.email,
                name: userModule.model.content.name,
                role: userModule.model.content.role,
              },
            },
          },
        },
      } as const),
    },
  },
  post: {
    changePassword: {
      in: {
        previousPassword: buildModel({ kind: 'primitive', content: 'string' } as const),
        newPassword: buildModel({ kind: 'primitive', content: 'string' } as const),
      },
      out: buildModel({
        kind: 'constant',
        content: ['notValidNewPassword', 'passwordUpdated', 'wrongPassword'] as const,
      } as const),
    },
    createUser: {
      in: {
        name: buildModel({
          kind: 'primitive',
          content: 'string',
        } as const),
        email: buildModel({
          kind: 'primitive',
          content: 'string',
        } as const),
        role: userModule.model.content.role,
      },
      out: buildModel({ kind: 'primitive', content: 'string' } as const),
    },
    deleteProblemReport: {
      in: {
        problemReportId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
      },
      out: buildModel({
        kind: 'primitive',
        content: 'void',
      } as const),
    },
    login: {
      in: {
        email: buildModel({
          kind: 'primitive',
          content: 'string',
        } as const),
        password: buildModel({
          kind: 'primitive',
          content: 'string',
        } as const),
      },
      out: buildModel({
        kind: 'object',
        content: {
          email: userModule.model.content.email,
          name: userModule.model.content.name,
          role: userModule.model.content.role,
          token: { kind: 'primitive', content: 'string' },
        },
      } as const),
    },
    monitoringEntries: {
      in: {
        newMonitoringEntries: buildModel({
          kind: 'array',
          content: monitoringEntryModule.fetchedModel,
        } as const),
      },
      out: buildModel({
        kind: 'primitive',
        content: 'void',
      } as const),
    },
    problemReport: {
      in: {
        documentId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
        problemType: problemReportModule.model.content.type,
        problemText: buildModel({
          kind: 'primitive',
          content: 'string',
        } as const),
      },
      out: buildModel({
        kind: 'primitive',
        content: 'void',
      } as const),
    },
    updateAssignationDocumentStatus: {
      in: {
        assignationId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
        status: documentModule.fetchedModel.content.status,
      },
      out: buildModel({
        kind: 'primitive',
        content: 'void',
      } as const),
    },
    updateDocumentStatus: {
      in: {
        documentId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
        status: documentModule.fetchedModel.content.status,
      },
      out: buildModel({
        kind: 'primitive',
        content: 'void',
      } as const),
    },
    updateProblemReportHasBeenRead: {
      in: {
        problemReportId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
        hasBeenRead: buildModel({
          kind: 'primitive',
          content: 'boolean',
        }),
      },
      out: {
        kind: 'primitive',
        content: 'void',
      },
    },
    updateTreatment: {
      in: {
        annotationsDiff: annotationsDiffModule.model,
        documentId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
      },
      out: buildModel({
        kind: 'primitive',
        content: 'void',
      } as const),
    },
  },
} as const;

type apiSchemaType = {
  get: apiSchemaMethodType;
  post: apiSchemaMethodType;
};

type apiSchemaMethodNameType = keyof apiSchemaType;

type apiSchemaMethodType = { [key: string]: apiSchemaEntryType };

type apiSchemaEntryType = { in?: { [param: string]: modelType }; out: modelType };

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: apiSchemaType = apiSchema;
