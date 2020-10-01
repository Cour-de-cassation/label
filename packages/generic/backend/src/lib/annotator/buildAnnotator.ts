import {
  annotationType,
  annotationReportType,
  documentType,
} from '@label/core';
import { buildAnnotationRepository } from '../../modules/annotation';
import { buildAnnotationReportRepository } from '../../modules/annotationReport';
import { documentService } from '../../modules/document';
import { logger } from '../../utils';
import { annotatorConfigType } from './annotatorConfigType';

export { buildAnnotator };

function buildAnnotator(annotatorConfig: annotatorConfigType) {
  return {
    async annotateDocumentsWithoutAnnotations() {
      const documentsToAnnotate = await documentService.fetchDocumentsWithoutAnnotations();
      await annotateDocuments(documentsToAnnotate);
    },
  };

  async function annotateDocuments(documents: documentType[]) {
    logger.log(
      `Fetching annotation with ${annotatorConfig.name} for ${documents.length} documents...`,
    );
    const annotationsAndReport = await Promise.all(
      documents.map(annotatorConfig.fetchAnnotationOfDocument),
    );
    logger.log(`Annotations fetched!`);

    const annotations = annotationsAndReport
      .map((annotationsAndReport) => annotationsAndReport.annotations)
      .flat();
    const reports = annotationsAndReport.map(
      (annotationsAndReport) => annotationsAndReport.report,
    );

    logger.log(
      `Insertion of ${annotations.length} annotations into the database...`,
    );
    await insertAnnotations(annotations);
    logger.log(`Insertion done!`);

    logger.log(`Insertion of ${reports.length} reports into the database...`);
    await insertReports(reports);
    logger.log(`Insertion done!`);
  }

  async function insertAnnotations(annotations: annotationType[]) {
    const annotationRepository = buildAnnotationRepository();

    for await (const annotation of annotations) {
      await annotationRepository.insert(annotation);
    }
  }

  async function insertReports(reports: annotationReportType[]) {
    const annotationReportRepository = buildAnnotationReportRepository();

    for await (const report of reports) {
      await annotationReportRepository.insert(report);
    }
  }
}
