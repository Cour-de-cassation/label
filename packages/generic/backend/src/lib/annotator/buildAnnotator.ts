import {
  annotationType,
  annotationReportType,
  buildAutoAnnotator,
  documentType,
  idType,
  settingsModule,
  idModule,
  settingsType,
  documentModule,
} from '@label/core';
import { buildAnnotationReportRepository } from '../../modules/annotationReport';
import { documentService } from '../../modules/document';
import { treatmentService } from '../../modules/treatment';
import { logger } from '../../utils';
import { annotatorConfigType } from './annotatorConfigType';
import { computeAdditionalAnnotations } from './computeAdditionalAnnotations';

export { buildAnnotator };

function buildAnnotator(
  settings: settingsType,
  annotatorConfig: annotatorConfigType,
) {
  return { annotateDocumentsWithoutAnnotations, reAnnotateFreeDocuments };

  async function annotateDocumentsWithoutAnnotations() {
    logger.log('annotateDocumentsWithoutAnnotations');

    const failedDocumentIds: documentType['_id'][] = [];
    const documentsCountToAnnotate = await documentService.countDocumentsWithoutAnnotations();
    logger.log(`Found ${documentsCountToAnnotate} documents to annotate`);
    let currentDocumentToAnnotate: documentType | undefined;
    let previousDocumentStatus: documentType['status'] | undefined;
    let documentsAnnotatedCount = 0;

    process.on('SIGINT', async function () {
      logger.log('Stopping...');

      if (currentDocumentToAnnotate) {
        logger.log(
          `Stopping annotating document ${formatDocumentInfos(
            currentDocumentToAnnotate,
          )}. Setting the document to its previous status...`,
        );
        await documentService.updateDocumentStatus(
          currentDocumentToAnnotate._id,
          previousDocumentStatus ?? 'free',
        );
        logger.log(
          `Document ${formatDocumentInfos(currentDocumentToAnnotate)} free!`,
        );
      }

      logger.log('STOPPED annotateDocumentsWithoutAnnotations');

      process.exit();
    });

    do {
      previousDocumentStatus = undefined;
      currentDocumentToAnnotate = await documentService.fetchDocumentWithoutAnnotationsNotIn(
        failedDocumentIds,
      );
      if (currentDocumentToAnnotate) {
        documentsAnnotatedCount++;
        logger.log(`Found a document to annotate. Reserving...`);
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
        logger.log(
          `Annotating with ${
            annotatorConfig.name
          } : ${documentsAnnotatedCount}/${documentsCountToAnnotate}... ${formatDocumentInfos(
            currentDocumentToAnnotate,
          )}`,
        );
        try {
          await annotateDocument(updatedDocument);
        } catch (error) {
          logger.error(error);
          failedDocumentIds.push(updatedDocument._id);
          logger.log(
            `Error while annotating document ${formatDocumentInfos(
              currentDocumentToAnnotate,
            )}. Setting the document to its previous status...`,
          );
          await documentService.updateDocumentStatus(
            currentDocumentToAnnotate._id,
            previousDocumentStatus,
          );
          logger.log(
            `Document ${formatDocumentInfos(currentDocumentToAnnotate)} free!`,
          );
        }
      }
    } while (
      currentDocumentToAnnotate !== undefined &&
      documentsAnnotatedCount < documentsCountToAnnotate
    );

    logger.log('DONE annotateDocumentsWithoutAnnotations');
  }

  async function reAnnotateFreeDocuments() {
    const documentIds = await documentService.fetchFreeDocumentsIds();

    for (const documentId of documentIds) {
      await documentService.updateDocumentStatus(documentId, 'loaded');
    }

    await annotateDocumentsWithoutAnnotations();
  }

  async function annotateDocument(document: documentType) {
    const {
      annotations,
      documentId,
      report,
    } = await annotatorConfig.fetchAnnotationOfDocument(settings, document);
    logger.log(`NLP annotation succeeded!`);

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
    await createAnnotatorTreatment({ annotations, documentId });
    logger.log(`NLP treatment created in DB`);
    const additionalAnnotations = computeAdditionalAnnotations(
      document,
      annotations,
      settingsModule.lib.additionalAnnotationCategoryHandler.getCategoryName(),
    );
    if (additionalAnnotations.length > 0) {
      logger.log(`Creating additional annotations treatment...`);
      await createAdditionalAnnotationsTreatment({
        annotations: additionalAnnotations,
        documentId: document._id,
      });
      logger.log(
        `Additional annotations treatment created in DB. Creating post-process treatment...`,
      );
      await createAutoTreatment({
        annotations: [...annotations, ...additionalAnnotations],
        documentId,
      });
    } else {
      logger.log(`Creating post-process treatment...`);
      await createAutoTreatment({
        annotations,
        documentId,
      });
    }
    logger.log(
      `Post-process treatment created. Creating report and updating document status...`,
    );

    await createReport(report);
    const nextDocumentStatus = documentModule.lib.getNextStatus({
      status: document.status,
      publicationCategory: document.publicationCategory,
      route: document.route,
    });
    await documentService.updateDocumentStatus(
      document._id,
      nextDocumentStatus,
    );
    logger.log(`Annotation done for document ${formatDocumentInfos(document)}`);
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

  async function createAdditionalAnnotationsTreatment({
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
        source: 'supplementaryAnnotations',
      },
      settings,
    );
  }

  async function createAutoTreatment({
    annotations,
    documentId,
  }: {
    annotations: annotationType[];
    documentId: idType;
  }) {
    const autoAnnotator = buildAutoAnnotator(settings);
    const autoTreatedAnnotations = autoAnnotator.annotate(annotations);
    await treatmentService.createTreatment(
      {
        documentId,
        previousAnnotations: annotations,
        nextAnnotations: autoTreatedAnnotations,
        source: 'postProcess',
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
