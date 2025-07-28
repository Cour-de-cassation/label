import {
  annotationModule,
  annotationsDiffModule,
  documentModule,
  problemReportModule,
  settingsModule,
  userModule,
  ressourceFilterModule,
  statisticModule,
  treatmentModule,
  replacementTermModule,
  preAssignationModule,
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
    documentStatistics: {
      in: {
        documentNumber: documentModule.fetchedModel.content.documentNumber,
      },
      out: {
        kind: 'array',
        content: buildModel({
          kind: 'object',
          content: {
            ...statisticModule.model.content,
            treatmentsSummary: {
              kind: 'array',
              content: {
                kind: 'object',
                content: {
                  id: {
                    kind: 'or',
                    content: [
                      buildModel({
                        kind: 'custom',
                        content: 'id',
                      } as const),
                      { kind: 'primitive', content: 'undefined' },
                    ],
                  },
                  statId: buildModel({
                    kind: 'custom',
                    content: 'id',
                  } as const),
                  treatmentDuration: { kind: 'primitive', content: 'number' },
                  name: {
                    kind: 'or',
                    content: [
                      { kind: 'primitive', content: 'string' },
                      { kind: 'primitive', content: 'undefined' },
                    ],
                  },
                },
              },
            },
          },
        }),
      },
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
          maxDate: {
            kind: 'or',
            content: [
              { kind: 'primitive', content: 'number' },
              { kind: 'primitive', content: 'undefined' },
            ],
          },
          minDate: {
            kind: 'or',
            content: [
              { kind: 'primitive', content: 'number' },
              { kind: 'primitive', content: 'undefined' },
            ],
          },
          routes: {
            kind: 'array',
            content: {
              kind: 'constant',
              content: ['automatic', 'exhaustive', 'simple', 'confirmation', 'request', 'default'] as const,
            },
          },
          importers: {
            kind: 'array',
            content: {
              kind: 'constant',
              content: ['recent', 'manual', 'default'] as const,
            },
          },
          sources: {
            kind: 'array',
            content: {
              kind: 'primitive',
              content: 'string',
            },
          },
          jurisdictions: {
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
      out: buildModel({
        kind: 'array',
        content: {
          kind: 'object',
          content: {
            document: documentModule.fetchedModel,
            assignationId: buildModel({
              kind: 'custom',
              content: 'id',
            } as const),
          },
        },
      }),
    },
    health: {
      out: buildModel({
        kind: 'primitive',
        content: 'boolean',
      } as const),
    },
    problemReportsWithDetails: {
      out: buildModel({
        kind: 'array',
        content: {
          kind: 'object',
          content: {
            problemReport: problemReportModule.model,
            document: {
              kind: 'or',
              content: [
                {
                  kind: 'object',
                  content: {
                    _id: documentModule.fetchedModel.content._id,
                    documentNumber: documentModule.fetchedModel.content.documentNumber,
                    source: documentModule.fetchedModel.content.source,
                    jurisdiction: documentModule.fetchedModel.content.decisionMetadata.content.jurisdiction,
                    appealNumber: documentModule.fetchedModel.content.decisionMetadata.content.appealNumber,
                    publicationCategory: documentModule.fetchedModel.content.publicationCategory,
                    route: documentModule.fetchedModel.content.route,
                    status: documentModule.fetchedModel.content.status,
                  },
                },
                { kind: 'primitive', content: 'undefined' },
              ],
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
    documentStatus: {
      in: {
        documentId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
      },
      out: documentModule.fetchedModel.content.status,
    },
    settings: {
      out: settingsModule.model,
    },
    summary: {
      in: {},
      out: buildModel({
        kind: 'object',
        content: {
          loadedDocuments: buildModel({
            kind: 'primitive',
            content: 'number',
          } as const),
          nlpAnnotatingDocuments: buildModel({
            kind: 'primitive',
            content: 'number',
          } as const),
          freeDocuments: buildModel({
            kind: 'primitive',
            content: 'number',
          } as const),
          pendingDocuments: buildModel({
            kind: 'primitive',
            content: 'number',
          } as const),
          savedDocuments: buildModel({
            kind: 'primitive',
            content: 'number',
          } as const),
          doneDocuments: buildModel({
            kind: 'primitive',
            content: 'number',
          } as const),
          lockedDocuments: buildModel({
            kind: 'primitive',
            content: 'number',
          } as const),
        },
      } as const),
    },
    publishableDocuments: {
      out: buildModel({
        kind: 'array',
        content: {
          kind: 'object',
          content: {
            _id: documentModule.fetchedModel.content._id,
            appealNumber: documentModule.fetchedModel.content.decisionMetadata.content.appealNumber,
            chamberName: documentModule.fetchedModel.content.decisionMetadata.content.chamberName,
            creationDate: documentModule.fetchedModel.content.creationDate,
            documentNumber: documentModule.fetchedModel.content.documentNumber,
            jurisdiction: documentModule.fetchedModel.content.decisionMetadata.content.jurisdiction,
            publicationCategory: documentModule.fetchedModel.content.publicationCategory,
            route: documentModule.fetchedModel.content.route,
            status: documentModule.fetchedModel.content.status,
          },
        },
      } as const),
    },
    toBeConfirmedDocuments: {
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
                jurisdiction: documentModule.fetchedModel.content.decisionMetadata.content.jurisdiction,
                occultationBlock: documentModule.fetchedModel.content.decisionMetadata.content.occultationBlock,
                reviewStatus: documentModule.fetchedModel.content.reviewStatus,
                publicationCategory: documentModule.fetchedModel.content.publicationCategory,
                route: documentModule.fetchedModel.content.route,
              },
            },
            totalTreatmentDuration: {
              kind: 'or',
              content: [
                { kind: 'primitive', content: 'number' },
                { kind: 'primitive', content: 'undefined' },
              ],
            },
            lastTreatmentDate: {
              kind: 'or',
              content: [
                { kind: 'primitive', content: 'number' },
                { kind: 'primitive', content: 'undefined' },
              ],
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
                creationDate: documentModule.fetchedModel.content.creationDate,
                documentNumber: documentModule.fetchedModel.content.documentNumber,
                jurisdiction: documentModule.fetchedModel.content.decisionMetadata.content.jurisdiction,
                loss: documentModule.fetchedModel.content.loss,
                occultationBlock: documentModule.fetchedModel.content.decisionMetadata.content.occultationBlock,
                publicationCategory: documentModule.fetchedModel.content.publicationCategory,
                reviewStatus: documentModule.fetchedModel.content.reviewStatus,
                route: documentModule.fetchedModel.content.route,
                source: documentModule.fetchedModel.content.source,
              },
            },
            totalTreatmentDuration: {
              kind: 'or',
              content: [
                { kind: 'primitive', content: 'number' },
                { kind: 'primitive', content: 'undefined' },
              ],
            },
            lastTreatmentDate: {
              kind: 'or',
              content: [
                { kind: 'primitive', content: 'number' },
                { kind: 'primitive', content: 'undefined' },
              ],
            },
            statistic: {
              kind: 'object',
              content: {
                surAnnotationsCount: {
                  kind: 'or',
                  content: [
                    { kind: 'primitive', content: 'number' },
                    { kind: 'primitive', content: 'undefined' },
                  ],
                },
                subAnnotationsSensitiveCount: {
                  kind: 'or',
                  content: [
                    { kind: 'primitive', content: 'number' },
                    { kind: 'primitive', content: 'undefined' },
                  ],
                },
                subAnnotationsNonSensitiveCount: {
                  kind: 'or',
                  content: [
                    { kind: 'primitive', content: 'number' },
                    { kind: 'primitive', content: 'undefined' },
                  ],
                },
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
    personalStatistics: {
      out: buildModel({
        kind: 'array',
        content: {
          kind: 'object',
          content: {
            day: { kind: 'primitive', content: 'number' },
            simple: { kind: 'primitive', content: 'number' },
            exhaustive: { kind: 'primitive', content: 'number' },
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
                decisionDate: documentModule.fetchedModel.content.decisionMetadata.content.date,
                documentNumber: documentModule.fetchedModel.content.documentNumber,
                occultationBlock: documentModule.fetchedModel.content.decisionMetadata.content.occultationBlock,
                jurisdiction: documentModule.fetchedModel.content.decisionMetadata.content.jurisdiction,
                publicationCategory: documentModule.fetchedModel.content.publicationCategory,
                route: documentModule.fetchedModel.content.route,
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
    mandatoryReplacementTerms: {
      in: {
        documentId: buildModel({
          kind: 'primitive',
          content: 'string',
        } as const),
      },
      out: buildModel({
        kind: 'array',
        content: replacementTermModule.model,
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
    preAssignations: {
      out: buildModel({
        kind: 'array',
        content: {
          kind: 'object',
          content: {
            preAssignation: preAssignationModule.model,
            userName: userModule.models.user.content.name,
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
    deletePreAssignation: {
      in: {
        preAssignationId: buildModel({
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
    deleteDocument: {
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
    resetTreatmentLastUpdateDate: {
      in: {
        assignationId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
      },
      out: buildModel({
        kind: 'primitive',
        content: 'void',
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
    updateDocumentRoute: {
      in: {
        documentId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
        route: documentModule.fetchedModel.content.route,
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
    updateTreatmentDuration: {
      in: {
        assignationId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
      },
      out: buildModel({
        kind: 'primitive',
        content: 'void',
      } as const),
    },
    updateTreatmentForAssignationId: {
      in: {
        annotationsDiff: annotationsDiffModule.model,
        assignationId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
      },
      out: buildModel({
        kind: 'primitive',
        content: 'void',
      } as const),
    },
    updateTreatmentForDocumentId: {
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
    createPreAssignation: {
      in: {
        userId: buildModel({
          kind: 'custom',
          content: 'id',
        } as const),
        source: buildModel({
          kind: 'primitive',
          content: 'string',
        } as const),
        number: buildModel({
          kind: 'primitive',
          content: 'string',
        } as const),
      },
      out: buildModel({ kind: 'primitive', content: 'void' } as const),
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
