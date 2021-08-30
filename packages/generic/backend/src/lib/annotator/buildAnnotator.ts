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
import { annotationReportService } from '../../modules/annotationReport';
import { assignationService } from '../../modules/assignation';
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

    const documentsCountToAnnotate = await documentService.countDocumentsWithoutAnnotations();
    logger.log(`Found ${documentsCountToAnnotate} documents to annotate`);
    let currentDocumentToAnnotate: documentType | undefined;
    let documentsAnnotatedCount = 0;
    do {
      currentDocumentToAnnotate = await documentService.fetchDocumentWithoutAnnotations();
      if (currentDocumentToAnnotate) {
        documentsAnnotatedCount++;
        logger.log(`Found a document to annotate. Reserving...`);
        const previousDocumentStatus = currentDocumentToAnnotate.status;
        const nextDocumentStatus = documentModule.lib.getNextStatus({
          status: currentDocumentToAnnotate.status,
          publicationCategory: currentDocumentToAnnotate.publicationCategory,
        });
        const updatedDocument = await documentService.updateDocumentStatus(
          currentDocumentToAnnotate._id,
          nextDocumentStatus,
        );
        logger.log(
          `Annotating with ${annotatorConfig.name} document ${documentsAnnotatedCount}/${documentsCountToAnnotate}...`,
        );
        try {
          await annotateDocument(updatedDocument);
        } catch (error) {
          logger.error(error);
          logger.log(
            `Error while annotating document ${idModule.lib.convertToString(
              currentDocumentToAnnotate._id,
            )}. Setting the document to its previous status...`,
          );
          await documentService.updateDocumentStatus(
            currentDocumentToAnnotate._id,
            previousDocumentStatus,
          );
          logger.log(
            `Document ${idModule.lib.convertToString(
              currentDocumentToAnnotate._id,
            )} free!`,
          );
        }
      }
    } while (
      currentDocumentToAnnotate !== undefined &&
      documentsAnnotatedCount < documentsCountToAnnotate
    );
  }

  async function reAnnotateFreeDocuments() {
    const documentIds = await documentService.fetchFreeDocumentsIds();

    for (const documentId of documentIds) {
      await annotationReportService.deleteAnnotationReportsByDocumentId(
        documentId,
      );
      await assignationService.deleteAssignationsByDocumentId(documentId);
      await treatmentService.deleteTreatmentsByDocumentId(documentId);

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
      logger.log(
        `Conflict of annotation on document ${idModule.lib.convertToString(
          document._id,
        )}. Skipping...`,
      );
      return;
    }
    await createAnnotatorTreatment({ annotations, documentId });
    const additionalAnnotations = computeAdditionalAnnotations(
      document,
      annotations,
      settingsModule.lib.additionalAnnotationCategoryHandler.getCategoryName(),
    );
    if (additionalAnnotations.length > 0) {
      await createAdditionalAnnotationsTreatment({
        annotations: additionalAnnotations,
        documentId: document._id,
      });
      await createAutoTreatment({
        annotations: [...annotations, ...additionalAnnotations],
        documentId,
      });
    } else {
      await createAutoTreatment({
        annotations,
        documentId,
      });
    }

    await createReport(report);
    const nextDocumentStatus = documentModule.lib.getNextStatus({
      status: document.status,
      publicationCategory: document.publicationCategory,
    });
    await documentService.updateDocumentStatus(
      document._id,
      nextDocumentStatus,
    );
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
}
