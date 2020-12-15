import { groupBy } from 'lodash';
import {
  annotationType,
  annotationReportType,
  documentType,
  treatmentModule,
  idModule,
} from '@label/core';
import { buildAnnotationRepository } from '../../modules/annotation';
import { buildAnnotationReportRepository } from '../../modules/annotationReport';
import { buildTreatmentRepository } from '../../modules/treatment';
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
    await insertTreatments(annotations);
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

  async function insertTreatments(annotations: annotationType[]) {
    const treatmentRepository = buildTreatmentRepository();

    const grouppedAnnotations = groupBy(annotations, (annotation) =>
      idModule.lib.convertToString(annotation.documentId),
    );
    return Promise.all(
      Object.entries(grouppedAnnotations).map((grouppedAnnotationEntry) => {
        const documentId = idModule.lib.buildId(grouppedAnnotationEntry[0]);
        const annotationIds = grouppedAnnotationEntry[1].map(({ _id }) => _id);
        // TO DO : handle non user treatment
        const userId = idModule.lib.buildId();

        const treatment = treatmentModule.lib.buildTreatment({
          annotationIds,
          documentId,
          userId,
          duration: 0,
          order: 0,
        });
        return treatmentRepository.insert(treatment);
      }),
    );
  }

  async function insertReports(reports: annotationReportType[]) {
    const annotationReportRepository = buildAnnotationReportRepository();

    for await (const report of reports) {
      await annotationReportRepository.insert(report);
    }
  }
}
