import {
  annotationType,
  annotationReportType,
  annotationsDiffModule,
  documentType,
  treatmentModule,
  idType,
} from '@label/core';
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
    const fetchedAnnotatingInformations = await Promise.all(
      documents.map(annotatorConfig.fetchAnnotationOfDocument),
    );
    logger.log(`Annotations fetched!`);

    const annotationsAndDocumentIds = fetchedAnnotatingInformations.map(
      (fetchedAnnotatingInformation) => ({
        annotations: fetchedAnnotatingInformation.annotations,
        documentId: fetchedAnnotatingInformation.documentId,
      }),
    );
    const reports = fetchedAnnotatingInformations.map(
      (fetchedAnnotatingInformation) => fetchedAnnotatingInformation.report,
    );

    logger.log(
      `Insertion of ${annotationsAndDocumentIds.length} treatments into the database...`,
    );
    await insertTreatments(annotationsAndDocumentIds);
    logger.log(`Insertion done!`);

    logger.log(`Insertion of ${reports.length} reports into the database...`);
    await insertReports(reports);
    logger.log(`Insertion done!`);
  }
}

async function insertTreatments(
  annotationsAndDocumentIds: {
    annotations: annotationType[];
    documentId: idType;
  }[],
) {
  const treatmentRepository = buildTreatmentRepository();

  return Promise.all(
    annotationsAndDocumentIds.map(({ annotations, documentId }) => {
      return treatmentRepository.insert(
        treatmentModule.lib.buildTreatment({
          documentId,
          duration: 0,
          order: 0,
          annotationsDiff: annotationsDiffModule.lib.buildAnnotationsDiff(
            [],
            annotations,
          ),
        }),
      );
    }),
  );
}

async function insertReports(reports: annotationReportType[]) {
  const annotationReportRepository = buildAnnotationReportRepository();

  for await (const report of reports) {
    await annotationReportRepository.insert(report);
  }
}
