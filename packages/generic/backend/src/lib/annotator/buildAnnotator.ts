import {
  annotationType,
  annotationReportType,
  buildAutoAnnotator,
  documentType,
  idType,
  settingsModule,
  idModule,
  settingsType,
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
        await documentService.updateDocumentStatus(
          currentDocumentToAnnotate._id,
          'nlpAnnotating',
        );
        logger.log(
          `Annotating with ${annotatorConfig.name} document ${documentsAnnotatedCount}/${documentsCountToAnnotate}...`,
        );
        try {
          await annotateDocument(currentDocumentToAnnotate);
        } catch (error) {
          logger.log(
            `Error while annotating document ${idModule.lib.convertToString(
              currentDocumentToAnnotate._id,
            )}. Freeing the reservation...`,
          );
          await documentService.updateDocumentStatus(
            currentDocumentToAnnotate._id,
            'loaded',
          );
          logger.log(
            `Document ${idModule.lib.convertToString(
              currentDocumentToAnnotate._id,
            )} free!`,
          );
        }
      }
    } while (currentDocumentToAnnotate !== undefined);
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
    await documentService.updateDocumentStatus(document._id, 'free');
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
