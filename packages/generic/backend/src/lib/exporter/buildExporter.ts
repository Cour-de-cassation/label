import {
  buildAnonymizer,
  documentModule,
  documentType,
  settingsModule,
  settingsType,
  treatmentModule,
} from '@label/core';
import { documentService } from '../../modules/document';
import { statisticService } from '../../modules/statistic';
import { treatmentService } from '../../modules/treatment';
import { logger } from '../../utils';
import { exporterConfigType } from './exporterConfigType';

export { buildExporter };

function buildExporter(
  settings: settingsType,
  exporterConfig: exporterConfigType,
) {
  return {
    exportAllTreatedDocuments,
    exportAllRejectedDocuments,
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

  async function exportAllTreatedDocuments() {
    logger.log('exportAllTreatedDocuments');
    logger.log(`Exportation to ${exporterConfig.name}`);

    logger.log(`Fetching all treated documents...`);
    const documentsToExport = await documentService.fetchAllExportableDocuments();
    logger.log(`${documentsToExport.length} documents to export`);

    logger.log(`Beginning exportation...`);
    for (let index = 0; index < documentsToExport.length; index++) {
      logger.log(
        `Exportation of document ${index + 1}/${documentsToExport.length}`,
      );
      const document = documentsToExport[index];

      await exportDocument(document);
    }

    logger.log(`Exportation done!`);
  }

  async function exportDocument(document: documentType) {
    const treatments = await treatmentService.fetchTreatmentsByDocumentId(
      document._id,
    );
    const annotations = treatmentModule.lib.computeAnnotations(treatments);
    const seed = documentModule.lib.computeCaseNumber(document);
    const settingsForDocument = settingsModule.lib.computeFilteredSettings(
      settings,
      document.decisionMetadata.categoriesToOmit,
      document.decisionMetadata.additionalTermsToAnnotate,
    );
    const anonymizer = buildAnonymizer(settingsForDocument, annotations, seed);

    await exporterConfig.sendDocumentPseudonymisationAndTreatments({
      externalId: document.externalId,
      pseudonymizationText: anonymizer.anonymizeDocument(document).text,
      labelTreatments: treatmentModule.lib.concat(treatments),
    });

    await statisticService.saveStatisticsOfDocument(document, settings);

    await documentService.deleteDocument(document._id);
  }

  async function exportAllRejectedDocuments() {
    logger.log('exportAllRejectedDocuments');
    logger.log(`Exportation to ${exporterConfig.name}`);

    logger.log(`Fetching all rejected documents...`);
    const rejectedDocuments = await documentService.fetchRejectedDocuments();
    logger.log(`${rejectedDocuments.length} rejected documents to export`);

    logger.log(`Beginning exportation...`);
    for (let index = 0; index < rejectedDocuments.length; index++) {
      logger.log(
        `Exportation of document ${index + 1}/${rejectedDocuments.length}`,
      );
      const document = rejectedDocuments[index];

      await exportRejectedDocument(document);
    }

    logger.log(`Exportation done!`);
  }

  async function exportRejectedDocument(document: documentType) {
    await exporterConfig.sendDocumentBlockedStatus(document.externalId);

    await statisticService.saveStatisticsOfDocument(document, settings);

    await documentService.deleteDocument(document._id);
  }
}
