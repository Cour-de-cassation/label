import {
  annotationType,
  annotationReportType,
  autoLinker,
  documentType,
  idType,
  settingsModule,
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
    } = await annotatorConfig.fetchAnnotationOfDocument(settings, document);

    await createAnnotatorTreatment({ annotations, documentId });
    await createAutoTreatment({ annotations, documentId });
    await createReport(report);
  }
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
  });
}

async function createAutoTreatment({
  annotations,
  documentId,
}: {
  annotations: annotationType[];
  documentId: idType;
}) {
  const autoTreatedAnnotations = autoLinker.autoLinkAll(annotations);
  await treatmentService.createTreatment({
    documentId,
    previousAnnotations: annotations,
    nextAnnotations: autoTreatedAnnotations,
  });
}

async function createReport(report: annotationReportType) {
  const annotationReportRepository = buildAnnotationReportRepository();
  await annotationReportRepository.insert(report);
}
