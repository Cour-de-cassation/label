import {
  annotationModule,
  annotationsDiffModule,
  annotationReportModule,
  documentModule,
  monitoringEntryModule,
  problemReportModule,
  settingsModule,
  userModule,
  ressourceFilterModule,
  statisticModule,
  treatmentModule,
} from '../modules';
import { buildModel, modelType } from '../modules/modelType';

export { apiSchema };

export type { apiSchemaType, apiSchemaMethodNameType, apiSchemaMethodType, apiSchemaEntryType };

const apiSchema = {
  get: {
    aggregatedStatistics: {
      in: {
        ressourceFilter: ressourceFilterModule.model,
      },
      out: buildModel({
        kind: 'object',
        content: {
          cumulatedValue: {
            kind: 'object',
            content: {
              subAnnotationsSensitiveCount: buildModel({
                kind: 'primitive',
                content: 'number',
              } as const),
              subAnnotationsNonSensitiveCount: buildModel({
                kind: 'primitive',
                content: 'number',
              } as const),
              surAnnotationsCount: buildModel({
                kind: 'primitive',
                content: 'number',
              } as const),
              treatmentDuration: treatmentModule.model.content.duration,
              annotationsCount: statisticModule.model.content.annotationsCount,
              wordsCount: statisticModule.model.content.wordsCount,
            },
          },
          total: { kind: 'primitive', content: 'number' },
        },
      } as const),
    },
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
    annotationsDiffDetails: {
      in: {
        documentId: buildModel({
          kind: 'primitive',
          content: 'string',
        } as const),
      },
      out: buildModel({
        kind: 'object',
        content: {
          addedAnnotations: {
            kind: 'array',
            content: {
              kind: 'object',
              content: {
                text: { kind: 'primitive', content: 'string' },
                textStart: { kind: 'primitive', content: 'number' },
                addedAnnotation: annotationModule.model,
              },
            },
          },
          deletedAnnotations: {
            kind: 'array',
            content: {
              kind: 'object',
              content: {
                text: { kind: 'primitive', content: 'string' },
                textStart: { kind: 'primitive', content: 'number' },
                deletedAnnotation: annotationModule.model,
              },
            },
          },
          resizedBiggerAnnotations: {
            kind: 'array',
            content: {
              kind: 'object',
              content: {
                text: { kind: 'primitive', content: 'string' },
                textStart: { kind: 'primitive', content: 'number' },
                annotationBefore: annotationModule.model,
                annotationAfter: annotationModule.model,
              },
            },
          },
          resizedSmallerAnnotations: {
            kind: 'array',
            content: {
              kind: 'object',
              content: {
                text: { kind: 'primitive', content: 'string' },
                textStart: { kind: 'primitive', content: 'number' },
                annotationBefore: annotationModule.model,
                annotationAfter: annotationModule.model,
              },
            },
          },
          categoryChangedAnnotations: {
            kind: 'array',
            content: {
              kind: 'object',
              content: {
                text: { kind: 'primitive', content: 'string' },
                textStart: { kind: 'primitive', content: 'number' },
                annotationBefore: annotationModule.model,
                annotationAfter: annotationModule.model,
              },
            },
          },
        },
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
    availableStatisticFilters: {
      out: buildModel({
        kind: 'object',
        content: {
          publicationCategories: {
            kind: 'array',
            content: {
              kind: 'primitive',
              content: 'string',
            },
          },
          sources: {
            kind: 'array',
            content: {
              kind: 'primitive',
              content: 'string',
            },
          },
        },
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
    documentsForUser: {
      in: {
        documentsMaxCount: buildModel({
          kind: 'primitive',
          content: 'number',
        } as const),
      },
      out: buildModel({ kind: 'array', content: documentModule.fetchedModel }),
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
                publicationCategory: documentModule.fetchedModel.content.publicationCategory,
              },
            },
            user: {
              kind: 'object',
              content: {
                email: userModule.models.user.content.email,
                name: userModule.models.user.content.name,
              },
            },
          },
        },
      } as const),
    },
    settings: {
      out: settingsModule.model,
    },
    publishableDocuments: {
      out: buildModel({
        kind: 'array',
        content: {
          kind: 'object',
          content: {
            _id: documentModule.fetchedModel.content._id,
            creationDate: documentModule.fetchedModel.content.creationDate,
            documentNumber: documentModule.fetchedModel.content.documentNumber,
            publicationCategory: documentModule.fetchedModel.content.publicationCategory,
            status: documentModule.fetchedModel.content.status,
          },
        },
      } as const),
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
                occultationBlock: documentModule.fetchedModel.content.decisionMetadata.content.occultationBlock,
                publicationCategory: documentModule.fetchedModel.content.publicationCategory,
                reviewStatus: documentModule.fetchedModel.content.reviewStatus,
                session: documentModule.fetchedModel.content.decisionMetadata.content.session,
                source: documentModule.fetchedModel.content.source,
              },
            },
            totalTreatmentDuration: {
              kind: 'primitive',
              content: 'number',
            },
            lastTreatmentDate: {
              kind: 'primitive',
              content: 'number',
            },
            statistic: {
              kind: 'object',
              content: {
                surAnnotationsCount: { kind: 'primitive', content: 'number' },
                subAnnotationsSensitiveCount: { kind: 'primitive', content: 'number' },
                subAnnotationsNonSensitiveCount: { kind: 'primitive', content: 'number' },
              },
            },
            userNames: {
              kind: 'array',
              content: {
                kind: 'primitive',
                content: 'string',
              },
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
            document: {
              kind: 'object',
              content: {
                _id: documentModule.fetchedModel.content._id,
                creationDate: documentModule.fetchedModel.content.creationDate,
                documentNumber: documentModule.fetchedModel.content.documentNumber,
                occultationBlock: documentModule.fetchedModel.content.decisionMetadata.content.occultationBlock,
                publicationCategory: documentModule.fetchedModel.content.publicationCategory,
                session: documentModule.fetchedModel.content.decisionMetadata.content.session,
                source: documentModule.fetchedModel.content.source,
                status: documentModule.fetchedModel.content.status,
              },
            },
            userNames: {
              kind: 'array',
              content: {
                kind: 'primitive',
                content: 'string',
              },
            },
          },
        },
      } as const),
    },
    workingUsers: {
      out: buildModel({
        kind: 'array',
        content: {
          kind: 'object',
          content: {
            _id: userModule.models.user.content._id,
            email: userModule.models.user.content.email,
            isActivated: userModule.models.user.content.isActivated,
            name: userModule.models.user.content.name,
            role: userModule.models.user.content.role,
          },
        },
      } as const),
    },
  },

  post: {
    assignDocumentToUser: {
      in: {
        documentId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
        userId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
      },
      out: documentModule.fetchedModel,
    },
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
        role: userModule.models.user.content.role,
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
    deleteHumanTreatmentsForDocument: {
      in: {
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
          _id: userModule.models.user.content._id,
          email: userModule.models.user.content.email,
          name: userModule.models.user.content.name,
          role: userModule.models.user.content.role,
          token: { kind: 'primitive', content: 'string' },
          passwordTimeValidityStatus: userModule.models.passwordTimeValidityStatus,
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
    resetPassword: {
      in: {
        userId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
      },
      out: buildModel({
        kind: 'primitive',
        content: 'string',
      } as const),
    },
    setDeletionDateForUser: {
      in: {
        userId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
      },
      out: buildModel({
        kind: 'primitive',
        content: 'void',
      } as const),
    },
    setIsActivatedForUser: {
      in: {
        userId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
        isActivated: userModule.models.user.content.isActivated,
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
      out: documentModule.fetchedModel,
    },
    updateDocumentReviewStatus: {
      in: {
        documentId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
        reviewStatus: { kind: 'constant', content: ['read', 'amended'] },
      },
      out: {
        kind: 'primitive',
        content: 'void',
      },
    },
    updateDocumentStatus: {
      in: {
        documentId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
        status: documentModule.fetchedModel.content.status,
      },
      out: documentModule.fetchedModel,
    },
    updatePublishableDocumentStatus: {
      in: {
        documentId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
        status: buildModel({
          kind: documentModule.fetchedModel.content.status.kind,
          content: ['done', 'toBePublished'],
        } as const),
      },
      out: documentModule.fetchedModel,
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
