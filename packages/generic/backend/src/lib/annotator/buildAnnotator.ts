import {
  annotationType,
  annotationReportType,
  documentType,
  documentModule,
  idType,
  idModule,
  settingsType,
  treatmentModule,
} from '@label/core';
import { buildAnnotationReportRepository } from '../../modules/annotationReport';
import { documentService } from '../../modules/document';
import { treatmentService } from '../../modules/treatment';
import { logger } from '../../utils';
import { annotatorConfigType } from './annotatorConfigType';

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
            msg: `Error while annotating document ${formatDocumentInfos(
              currentDocumentToAnnotate,
            )}. Setting the document to its previous status...`,
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

    for (const documentId of documentIds) {
      await documentService.updateDocumentStatus(documentId, 'loaded');
    }

    await annotateDocumentsWithoutAnnotations();
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
      report,
      newCategoriesToOmit,
      computedAdditionalTerms,
      additionalTermsParsingFailed,
    } = await annotatorConfig.fetchAnnotationOfDocument(settings, document);
    logger.log({
      operationName: 'annotateDocument',
      msg: 'NLP annotation succeeded',
    });

    if (document.route == 'simple' && annotations.length == 0) {
      await documentService.updateDocumentRoute(documentId, 'automatic');
      logger.log({
        operationName: 'annotateDocument',
        msg: 'Route switched to automatic',
      });
    }

    await createAnnotatorTreatment({ annotations, documentId });
    logger.log({
      operationName: 'annotateDocument',
      msg: 'NLP treatment created in DB',
    });

    //Todo : create report only if report is not null
    await createReport(report);
    logger.log({
      operationName: 'annotateDocument',
      msg: 'Annotation report created in DB',
    });

    if (
      additionalTermsParsingFailed !== null &&
      additionalTermsParsingFailed !== undefined
    ) {
      logger.log({
        operationName: 'annotateDocument',
        msg: `additionalTermsParsingFailed found, updating with value ${additionalTermsParsingFailed}`,
      });
      await documentService.updateDocumentAdditionalTermsParsingFailed(
        documentId,
        additionalTermsParsingFailed,
      );
    }
    if (!!newCategoriesToOmit) {
      logger.log({
        operationName: 'annotateDocument',
        msg: 'New categories to omit found, updating...',
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
      });

      await documentService.updateDocumentComputedAdditionalTerms(
        documentId,
        computedAdditionalTerms,
      );
    }

    const nextDocumentStatus = documentModule.lib.getNextStatus({
      status: document.status,
      publicationCategory: document.publicationCategory,
      route: document.route,
    });
    await documentService.updateDocumentStatus(
      document._id,
      nextDocumentStatus,
    );
    logger.log({
      operationName: 'annotateDocument',
      msg: `Annotation done for document ${formatDocumentInfos(document)}`,
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

  async function createReport(report: annotationReportType) {
    const annotationReportRepository = buildAnnotationReportRepository();
    await annotationReportRepository.insert(report);
  }

  function formatDocumentInfos(document: documentType) {
    return `[${idModule.lib.convertToString(document._id)} ${document.source} ${
      document.documentNumber
    }]`;
  }
}
