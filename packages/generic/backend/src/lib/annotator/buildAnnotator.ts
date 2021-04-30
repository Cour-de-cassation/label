import {
  annotationType,
  annotationReportType,
  buildAutoAnnotator,
  documentType,
  idType,
  settingsModule,
  idModule,
} from '@label/core';
import { buildAnnotationReportRepository } from '../../modules/annotationReport';
import { treatmentService } from '../../modules/treatment';
import { documentService } from '../../modules/document';
import { logger } from '../../utils';
import { annotatorConfigType } from './annotatorConfigType';

export { buildAnnotator };

function buildAnnotator(
  settingsJson: string,
  annotatorConfig: annotatorConfigType,
) {
  const settings = settingsModule.lib.parseFromJson(settingsJson);

  return {
    async annotateDocumentsWithoutAnnotations() {
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
          await annotateDocument(currentDocumentToAnnotate);
        }
      } while (currentDocumentToAnnotate !== undefined);
    },
  };

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
    await createAutoTreatment({ annotations, documentId });
    await createReport(report);
  }

  async function createAnnotatorTreatment({
    annotations,
    documentId,
  }: {
    annotations: annotationType[];
    documentId: idType;
  }) {
    await treatmentService.createTreatment({
      documentId,
      previousAnnotations: [],
      nextAnnotations: annotations,
      source: 'NLP',
    });
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
    await treatmentService.createTreatment({
      documentId,
      previousAnnotations: annotations,
      nextAnnotations: autoTreatedAnnotations,
      source: 'postProcess',
    });
  }

  async function createReport(report: annotationReportType) {
    const annotationReportRepository = buildAnnotationReportRepository();
    await annotationReportRepository.insert(report);
  }
}
