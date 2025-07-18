import {
  annotationType,
  documentType,
  documentModule,
  idType,
  idModule,
  settingsType,
  treatmentModule,
  annotationModule,
  settingsModule,
} from '@label/core';
import { documentService } from '../../modules/document';
import { treatmentService } from '../../modules/treatment';
import { logger } from '../../utils';
import { annotatorConfigType } from './annotatorConfigType';
import { buildPreAssignator } from '../preAssignator';
import { extractRoute } from '../extractRoute';

export { buildAnnotator };

function buildAnnotator(
  settings: settingsType,
  annotatorConfig: annotatorConfigType,
) {
  return {
    annotateDocumentsWithoutAnnotations,
    reAnnotateFreeDocuments,
    fillLossOfAllTreatedDocuments,
  };

  async function fillLossOfAllTreatedDocuments() {
    logger.log({
      operationName: 'fillLossOfAllTreatedDocuments',
      msg: 'START',
    });

    const failedDocumentIds: documentType['_id'][] = [];
    const documentsCountToFill = await documentService.countDoneDocumentsWithoutLossNotIn(
      failedDocumentIds,
    );
    logger.log({
      operationName: 'fillLossOfAllTreatedDocuments',
      msg: `Found ${documentsCountToFill} documents without loss`,
    });
    let currentDocumentToFillLoss: documentType | undefined;
    let documentsFilledLossCount = 0;
    do {
      currentDocumentToFillLoss = await documentService.fetchDoneDocumentWithoutLossNotIn(
        failedDocumentIds,
      );
      if (currentDocumentToFillLoss) {
        documentsFilledLossCount++;
        try {
          const currentTreatmentsOfDocument = await treatmentService.fetchTreatmentsByDocumentId(
            currentDocumentToFillLoss._id,
          );
          const loss = await annotatorConfig.fetchLossOfDocument(
            currentDocumentToFillLoss,
            treatmentModule.lib.concat(currentTreatmentsOfDocument),
          );
          await documentService.updateDocumentLoss(
            currentDocumentToFillLoss._id,
            loss,
          );
        } catch (error) {
          failedDocumentIds.push(currentDocumentToFillLoss._id);
          logger.log({
            operationName: 'fillLossOfAllTreatedDocuments',
            msg: `Error while filling loss of document ${idModule.lib.convertToString(
              currentDocumentToFillLoss._id,
            )}`,
          });
        }
      }
    } while (
      currentDocumentToFillLoss !== undefined &&
      documentsFilledLossCount < documentsCountToFill
    );
  }

  async function annotateDocumentsWithoutAnnotations() {
    logger.log({
      operationName: 'annotateDocumentsWithoutAnnotations',
      msg: 'START',
    });

    const failedDocumentIds: documentType['_id'][] = [];
    const documentsCountToAnnotate = await documentService.countLoadedDocuments();
    logger.log({
      operationName: 'annotateDocumentsWithoutAnnotations',
      msg: `Found ${documentsCountToAnnotate} documents to annotate`,
    });
    let currentDocumentToAnnotate: documentType | undefined;
    let previousDocumentStatus: documentType['status'] | undefined;
    let documentsAnnotatedCount = 0;

    do {
      previousDocumentStatus = undefined;
      currentDocumentToAnnotate = await documentService.fetchDocumentWithoutAnnotationsNotIn(
        failedDocumentIds,
      );
      if (currentDocumentToAnnotate) {
        documentsAnnotatedCount++;
        logger.log({
          operationName: 'annotateDocumentsWithoutAnnotations',
          msg: `Found a document to annotate. Reserving...`,
        });
        previousDocumentStatus = currentDocumentToAnnotate.status;
        const nextDocumentStatus = documentModule.lib.getNextStatus({
          status: currentDocumentToAnnotate.status,
          publicationCategory: currentDocumentToAnnotate.publicationCategory,
          route: currentDocumentToAnnotate.route,
        });
        const updatedDocument = await documentService.updateDocumentStatus(
          currentDocumentToAnnotate._id,
          nextDocumentStatus,
        );
        logger.log({
          operationName: 'annotateDocumentsWithoutAnnotations',
          msg: `Annotating with ${
            annotatorConfig.name
          } : ${documentsAnnotatedCount}/${documentsCountToAnnotate}... ${formatDocumentInfos(
            currentDocumentToAnnotate,
          )}`,
        });
        try {
          await annotateDocument(updatedDocument);
        } catch (error) {
          failedDocumentIds.push(updatedDocument._id);
          logger.log({
            operationName: 'annotateDocumentsWithoutAnnotations',
            msg: `${error}`,
            data: {
              decision: {
                sourceId: currentDocumentToAnnotate.documentNumber,
                sourceName: currentDocumentToAnnotate.source,
              },
            },
          });
          await documentService.updateDocumentStatus(
            currentDocumentToAnnotate._id,
            previousDocumentStatus,
          );
          logger.log({
            operationName: 'annotateDocumentsWithoutAnnotations',
            msg: `Document ${formatDocumentInfos(
              currentDocumentToAnnotate,
            )} free!`,
          });
        }
      }
    } while (
      currentDocumentToAnnotate !== undefined &&
      documentsAnnotatedCount < documentsCountToAnnotate
    );

    logger.log({
      operationName: 'annotateDocumentsWithoutAnnotations',
      msg: 'DONE',
    });
  }

  async function reAnnotateFreeDocuments() {
    const documentIds = await documentService.fetchFreeDocumentsIds();

    logger.log({
      operationName: 'reAnnotateFreeDocuments',
      msg: `Found ${documentIds.length} free documents to reannotate, deleting their treatments and annotation report.`,
    });

    for (const documentId of documentIds) {
      await treatmentService.deleteTreatmentsByDocumentId(documentId);
      await documentService.updateDocumentChecklist(documentId, []);
      await documentService.updateDocumentStatus(documentId, 'loaded');
    }
  }

  async function annotateDocument(document: documentType) {
    const previousTreatments = await treatmentService.fetchTreatmentsByDocumentId(
      document._id,
    );
    if (previousTreatments.length > 0) {
      throw new Error(
        `Conflict of annotation on document ${formatDocumentInfos(
          document,
        )}. Skipping...`,
      );
    }

    const {
      annotations,
      documentId,
      checklist,
      newCategoriesToAnnotate,
      newCategoriesToUnAnnotate,
      computedAdditionalTerms,
      additionalTermsParsingFailed,
      version,
    } = await annotatorConfig.fetchAnnotationOfDocument(settings, document);
    logger.log({
      operationName: 'annotateDocument',
      msg: 'NLP annotation succesfully fetched',
      data: {
        decision: {
          sourceId: document.documentNumber,
          sourceName: document.source,
        },
      },
    });
    documentService.updateDocumentNlpVersions(documentId, version);

    await createAnnotatorTreatment({ annotations, documentId });
    logger.log({
      operationName: 'annotateDocument',
      msg: 'NLP treatment created in DB',
      data: {
        decision: {
          sourceId: document.documentNumber,
          sourceName: document.source,
        },
      },
    });

    if (document.decisionMetadata.motivationOccultation) {
      const zones = document.zoning?.zones;
      const motivations = zones?.motivations;
      const exposeDuLitige = zones?.['expose du litige'];

      if (motivations || exposeDuLitige) {
        logger.log({
          operationName: 'annotateDocument',
          msg: 'Annotate motif zone because motivationOccultation is true',
          data: {
            decision: {
              sourceId: document.documentNumber,
              sourceName: document.source,
            },
          },
        });

        if (
          (motivations && motivations?.length > 1) ||
          (exposeDuLitige && exposeDuLitige?.length > 1)
        ) {
          throw new Error(
            'Cannot annotate motifs with multiple motivations or expose du litige zones',
          );
        } else {
          createMotifOccultationTreatment(
            documentId,
            motivations?.[0],
            exposeDuLitige?.[0],
            document.text,
            annotations,
          );
        }
      }
    }

    if (checklist.length > 0) {
      await documentService.updateDocumentChecklist(document._id, checklist);
      logger.log({
        operationName: 'annotateDocument',
        msg: 'Checklist added to document',
        data: {
          decision: {
            sourceId: document.documentNumber,
            sourceName: document.source,
          },
        },
      });
    }
    if (
      additionalTermsParsingFailed !== null &&
      additionalTermsParsingFailed !== undefined
    ) {
      logger.log({
        operationName: 'annotateDocument',
        msg: `additionalTermsParsingFailed found, updating with value ${additionalTermsParsingFailed}`,
        data: {
          decision: {
            sourceId: document.documentNumber,
            sourceName: document.source,
          },
        },
      });
      await documentService.updateDocumentAdditionalTermsParsingFailed(
        documentId,
        additionalTermsParsingFailed,
      );
    }

    let newCategoriesToOmit = document.decisionMetadata.categoriesToOmit;
    if (!!newCategoriesToUnAnnotate) {
      logger.log({
        operationName: 'annotateDocument',
        msg: `categoriesToUnAnnotate found, adding '${newCategoriesToUnAnnotate}' to categoriesToOmit if not already in`,
        data: {
          decision: {
            sourceId: document.documentNumber,
            sourceName: document.source,
          },
        },
      });
      newCategoriesToOmit = Array.from(
        new Set(newCategoriesToOmit.concat(newCategoriesToUnAnnotate)),
      );
    }

    if (!!newCategoriesToAnnotate) {
      logger.log({
        operationName: 'annotateDocument',
        msg: `categoriesToAnnotate found, removing '${newCategoriesToAnnotate}' from categoriesToOmit if present`,
        data: {
          decision: {
            sourceId: document.documentNumber,
            sourceName: document.source,
          },
        },
      });
      newCategoriesToOmit = newCategoriesToOmit.filter(
        (category) => !newCategoriesToAnnotate.includes(category),
      );
    }

    if (document.decisionMetadata.categoriesToOmit != newCategoriesToOmit) {
      logger.log({
        operationName: 'annotateDocument',
        msg: `updating categoriesToOmit in database`,
        data: {
          decision: {
            sourceId: document.documentNumber,
            sourceName: document.source,
          },
        },
      });
      await documentService.updateDocumentCategoriesToOmit(
        documentId,
        newCategoriesToOmit,
      );
    }

    if (!!computedAdditionalTerms) {
      logger.log({
        operationName: 'annotateDocument',
        msg:
          'Additionals terms to annotate or to unannotate found, adding to document...',
        data: {
          decision: {
            sourceId: document.documentNumber,
            sourceName: document.source,
          },
        },
      });

      await documentService.updateDocumentComputedAdditionalTerms(
        documentId,
        computedAdditionalTerms,
      );
    }

    const preAssignator = buildPreAssignator();
    const isPreassignated = await preAssignator.preAssignDocument(document);

    // in case of pre-assignation, lyfecycle is manage by pre-assignator
    if (!isPreassignated) {
      const documentRoute = await extractRoute({ ...document, checklist });
      await documentService.updateDocumentRoute(document._id, documentRoute);

      const nextDocumentStatus = documentModule.lib.getNextStatus({
        status: document.status,
        publicationCategory: document.publicationCategory,
        route: documentRoute,
      });
      await documentService.updateDocumentStatus(
        document._id,
        nextDocumentStatus,
      );
    }

    logger.log({
      operationName: 'annotateDocument',
      msg: `Annotation done for document ${formatDocumentInfos(document)}`,
      data: {
        decision: {
          sourceId: document.documentNumber,
          sourceName: document.source,
        },
      },
    });
  }

  async function createAnnotatorTreatment({
    annotations,
    documentId,
  }: {
    annotations: annotationType[];
    documentId: idType;
  }) {
    await treatmentService.createTreatment(
      {
        documentId,
        previousAnnotations: [],
        nextAnnotations: annotations,
        source: 'NLP',
      },
      settings,
    );
  }

  async function createMotifOccultationTreatment(
    documentId: documentType['_id'],
    motivation: { start: number; end: number } | undefined,
    exposeDuLitige: { start: number; end: number } | undefined,
    documentText: string,
    previousAnnotations: annotationType[],
  ) {
    const motifsAnnotations: annotationType[] = [];

    function extractAndAnnotate(
      range: { start: number; end: number },
      source: string,
    ): annotationType | null {
      const rawZoneText = documentText.substring(range.start, range.end);
      const trimmedStart = rawZoneText.replace(/^[\s\r\n]+/, '');
      const removedCharactersAtStart = rawZoneText.length - trimmedStart.length;
      const finalTrimmedText = trimmedStart.replace(/[\s\r\n]+$/, '');

      if (!finalTrimmedText) return null;

      return annotationModule.lib.buildAnnotation({
        start: range.start + removedCharactersAtStart,
        text: finalTrimmedText,
        category: settingsModule.lib.motivationCategoryHandler.getCategoryName(),
        score: 1,
        source,
      });
    }

    if (motivation) {
      const annotation = extractAndAnnotate(motivation, 'motivation');
      if (annotation) {
        logger.log({
          operationName: 'annotateDocument',
          msg: 'Motivation zone found, annotating...',
        });
        motifsAnnotations.push(annotation);
      }
    }

    if (exposeDuLitige) {
      const annotation = extractAndAnnotate(exposeDuLitige, 'exposeDuLitige');
      if (annotation) {
        logger.log({
          operationName: 'annotateDocument',
          msg: 'Expose du litige zone found, annotating...',
        });
        motifsAnnotations.push(annotation);
      }
    }

    const annotationWithoutOverlapping = annotationModule.lib.removeOverlappingAnnotations(
      [...previousAnnotations, ...motifsAnnotations],
    );

    await treatmentService.createTreatment(
      {
        documentId,
        previousAnnotations: previousAnnotations,
        nextAnnotations: annotationWithoutOverlapping,
        source: 'supplementaryAnnotations',
      },
      settings,
    );
  }

  function formatDocumentInfos(document: documentType) {
    return `[${idModule.lib.convertToString(document._id)} ${document.source} ${
      document.documentNumber
    }]`;
  }
}
