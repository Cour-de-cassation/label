import {
  buildAnonymizer,
  documentModule,
  documentType,
  settingsType,
  treatmentModule,
  treatmentType,
} from '@label/core';
import { documentService } from '../../modules/document';
import { statisticService } from '../../modules/statistic';
import { treatmentService } from '../../modules/treatment';
import { logger } from '../../utils';
import { exporterConfigType, labelTreatmentsType } from './exporterConfigType';

export { buildExporter };

function buildExporter(
  settings: settingsType,
  exporterConfig: exporterConfigType,
) {
  return {
    exportSpecificDocument,
    exportTreatedDocumentsSince,
    exportTreatedPublishableDocuments,
  };

  async function exportTreatedDocumentsSince(days: number) {
    logger.log('exportTreatedDocumentsSince');
    logger.log(`Exportation to ${exporterConfig.name}`);

    logger.log(`Fetching treated documents...`);
    const documentsReadyToExport = await documentService.fetchDocumentsReadyToExport(
      days,
    );
    logger.log(`${documentsReadyToExport.length} documents to export`);

    logger.log(`Beginning exportation...`);
    for (let index = 0; index < documentsReadyToExport.length; index++) {
      logger.log(
        `Exportation of document ${index + 1}/${documentsReadyToExport.length}`,
      );
      const document = documentsReadyToExport[index];

      await exportDocument(document);
    }

    logger.log(`Exportation done!`);
  }

  async function exportTreatedPublishableDocuments() {
    logger.log('exportTreatedPublishableDocuments');
    logger.log(`Exportation to ${exporterConfig.name}`);

    logger.log(`Fetching treated documents from today...`);
    const documentsReadyToExport = await documentService.fetchPublishableDocumentsToExport();
    logger.log(`${documentsReadyToExport.length} documents to export`);

    logger.log(`Beginning exportation...`);
    for (let index = 0; index < documentsReadyToExport.length; index++) {
      logger.log(
        `Exportation of document ${index + 1}/${documentsReadyToExport.length}`,
      );
      const document = documentsReadyToExport[index];

      await exportDocument(document);
    }

    logger.log(`Exportation done!`);
  }

  async function exportSpecificDocument({
    documentNumber,
    source,
  }: {
    documentNumber: number;
    source: string;
  }) {
    logger.log(
      `exportSpecificDocument: documentNumber ${documentNumber} - source ${source}`,
    );
    const document = await documentService.fetchDocumentBySourceAndDocumentNumber(
      { documentNumber, source },
    );

    if (!document) {
      logger.error(
        `The document you specified (documentNumber ${documentNumber} - source ${source}) does not exist in the database`,
      );
      return;
    }

    if (document.status !== 'toBePublished' && document.status !== 'done') {
      logger.error(
        `The document you specified has been found, but is not ready to be exported (status: ${document.status})`,
      );
      return;
    }

    logger.log(`Document found. Exporting...`);

    await exportDocument(document);

    logger.log(`Exportation done!`);
  }

  async function exportDocument(document: documentType) {
    const treatments = await treatmentService.fetchTreatmentsByDocumentId(
      document._id,
    );
    const annotations = treatmentModule.lib.computeAnnotations(treatments);
    const seed = documentModule.lib.computeCaseNumber(document);
    const anonymizer = buildAnonymizer(settings, annotations, seed);

    await exporterConfig.sendDocumentPseudonymisationAndTreatments({
      externalId: document.externalId,
      pseudonymizationText: anonymizer.anonymizeDocument(document).text,
      labelTreatments: buildLabelTreatments(treatments),
    });

    await statisticService.saveStatisticsOfDocument(document, settings);

    await documentService.deleteDocument(document._id);
  }
}

function buildLabelTreatments(
  treatments: treatmentType[],
): labelTreatmentsType {
  const labelTreatments = [];

  const sortedTreatments = treatments.sort(
    (treatment1, treatment2) => treatment1.order - treatment2.order,
  );

  while (sortedTreatments.length > 0) {
    const order = sortedTreatments.length;

    labelTreatments.unshift({
      annotations: treatmentModule.lib.computeAnnotations(sortedTreatments),
      source: computeSource(order),
      order,
    });
    sortedTreatments.pop();
  }

  return labelTreatments;

  function computeSource(order: number) {
    switch (order) {
      case 1:
        return 'NLP';
      case 2:
        return 'LABEL_AUTO_TREATMENT';
      default:
        return 'LABEL_WORKING_USER_TREATMENT';
    }
  }
}
