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
    for (let ind = 0; ind < documents.length; ind++) {
      logger.log(
        `Annotating  with ${annotatorConfig.name} document ${ind + 1}/${
          documents.length
        }`,
      );
      await annotateDocument(documents[ind]);
    }
  }

  async function annotateDocument(document: documentType) {
    const {
      annotations,
      documentId,
      report,
    } = await annotatorConfig.fetchAnnotationOfDocument(document);

    await insertTreatment({ annotations, documentId });
    await insertReport(report);
  }
}

async function insertTreatment({
  annotations,
  documentId,
}: {
  annotations: annotationType[];
  documentId: idType;
}) {
  const treatmentRepository = buildTreatmentRepository();

  return treatmentRepository.insert(
    treatmentModule.lib.buildTreatment({
      date: new Date().getTime(),
      documentId,
      duration: 0,
      order: 0,
      annotationsDiff: annotationsDiffModule.lib.buildAnnotationsDiff(
        [],
        annotations,
      ),
    }),
  );
}

async function insertReport(report: annotationReportType) {
  const annotationReportRepository = buildAnnotationReportRepository();
  await annotationReportRepository.insert(report);
}
