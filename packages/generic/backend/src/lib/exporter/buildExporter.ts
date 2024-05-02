import {
  buildAnonymizer,
  documentModule,
  documentType,
  environmentType,
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
  environment: environmentType,
  exporterConfig: exporterConfigType,
  settings: settingsType,
) {
  return {
    exportAllTreatedDocuments,
    exportAllRejectedDocuments,
    exportSpecificDocument,
    exportTreatedDocumentsSince,
    exportTreatedPublishableDocuments,
  };

  async function exportTreatedDocumentsSince(
    days: number,
    environment: environmentType,
  ) {
    logger.log({
      operationName: 'exportTreatedDocumentsSince',
      msg: `START: Exportation to ${exporterConfig.name}`,
    });

    logger.log({
      operationName: 'exportTreatedDocumentsSince',
      msg: `Fetching treated documents...`,
    });
    const documentsReadyToExport = await documentService.fetchDocumentsReadyToExport(
      days,
    );
    logger.log({
      operationName: 'exportTreatedDocumentsSince',
      msg: `${documentsReadyToExport.length} documents to export`,
    });

    logger.log({
      operationName: 'exportTreatedDocumentsSince',
      msg: `Beginning exportation...`,
    });
    for (let index = 0; index < documentsReadyToExport.length; index++) {
      logger.log({
        operationName: 'exportTreatedDocumentsSince',
        msg: `Exportation of document ${index + 1}/${
          documentsReadyToExport.length
        }`,
      });
      const document = documentsReadyToExport[index];

      await exportDocument(document, environment);
    }

    logger.log({ operationName: 'exportTreatedDocumentsSince', msg: 'DONE' });
  }

  async function exportTreatedPublishableDocuments(
    environment: environmentType,
  ) {
    logger.log({
      operationName: 'exportTreatedPublishableDocuments',
      msg: `START: Exportation to ${exporterConfig.name}`,
    });

    logger.log({
      operationName: 'exportTreatedPublishableDocuments',
      msg: `Fetching treated documents from today...`,
    });
    const documentsReadyToExport = await documentService.fetchPublishableDocumentsToExport();
    logger.log({
      operationName: 'exportTreatedPublishableDocuments',
      msg: `${documentsReadyToExport.length} documents to export`,
    });

    logger.log({
      operationName: 'exportTreatedPublishableDocuments',
      msg: `Beginning exportation...`,
    });
    for (let index = 0; index < documentsReadyToExport.length; index++) {
      logger.log({
        operationName: 'exportTreatedPublishableDocuments',
        msg: `Exportation of document ${index + 1}/${
          documentsReadyToExport.length
        }`,
      });
      const document = documentsReadyToExport[index];

      await exportDocument(document, environment);
    }

    logger.log({
      operationName: 'exportTreatedPublishableDocuments',
      msg: 'DONE',
    });
  }

  async function exportSpecificDocument({
    documentNumber,
    source,
    environment,
  }: {
    documentNumber: number;
    source: string;
    environment: environmentType;
  }) {
    logger.log({
      operationName: 'exportSpecificDocument',
      msg: `START: documentNumber ${documentNumber} - source ${source}`,
    });
    const document = await documentService.fetchDocumentBySourceAndDocumentNumber(
      { documentNumber, source },
    );

    if (!document) {
      logger.error({
        operationName: 'exportSpecificDocument',
        msg: `The document you specified (documentNumber ${documentNumber} - source ${source}) does not exist in the database`,
      });
      return;
    }

    if (document.status !== 'toBePublished' && document.status !== 'done') {
      logger.error({
        operationName: 'exportSpecificDocument',
        msg: `The document you specified has been found, but is not ready to be exported (status: ${document.status})`,
      });
      return;
    }

    logger.log({
      operationName: 'exportSpecificDocument',
      msg: `Document found. Exporting...`,
    });

    await exportDocument(document, environment);

    logger.log({ operationName: 'exportSpecificDocument', msg: 'DONE' });
  }

  async function exportAllTreatedDocuments(environment: environmentType) {
    logger.log({
      operationName: 'exportAllTreatedDocuments',
      msg: `START: Exportation to ${exporterConfig.name}`,
    });

    logger.log({
      operationName: 'exportAllTreatedDocuments',
      msg: `Fetching all treated documents...`,
    });
    const documentsToExport = await documentService.fetchAllExportableDocuments();
    logger.log({
      operationName: 'exportAllTreatedDocuments',
      msg: `${documentsToExport.length} documents to export`,
    });

    logger.log({
      operationName: 'exportAllTreatedDocuments',
      msg: `Beginning exportation...`,
    });
    for (let index = 0; index < documentsToExport.length; index++) {
      logger.log({
        operationName: 'exportAllTreatedDocuments',
        msg: `Exportation of document ${index + 1}/${documentsToExport.length}`,
      });
      const document = documentsToExport[index];

      await exportDocument(document, environment);
    }

    logger.log({ operationName: 'exportAllTreatedDocuments', msg: 'DONE' });
  }

  async function exportDocument(
    document: documentType,
    environment: environmentType,
  ) {
    const treatments = await treatmentService.fetchTreatmentsByDocumentId(
      document._id,
    );
    const annotations = treatmentModule.lib.computeAnnotations(treatments);
    const seed = documentModule.lib.computeCaseNumber(document);
    const settingsForDocument = settingsModule.lib.computeFilteredSettings(
      settings,
      document.decisionMetadata.categoriesToOmit,
      document.decisionMetadata.additionalTermsToAnnotate,
      document.decisionMetadata.computedAdditionalTerms,
      document.decisionMetadata.additionalTermsParsingFailed,
      document.decisionMetadata.debatPublic,
    );
    const anonymizer = buildAnonymizer(settingsForDocument, annotations, seed);

    try {
      await exporterConfig.sendDocumentPseudonymisationAndTreatments({
        externalId: document.externalId,
        pseudonymizationText: anonymizer.anonymizeDocument(document).text,
        labelTreatments: treatmentModule.lib.concat(treatments),
        environment,
      });

      await statisticService.saveStatisticsOfDocument(document, settings);

      await documentService.deleteDocument(document._id);
    } catch (error) {
      logger.error({
        operationName: 'exportDocument',
        msg: `Export failed for document [${document._id} ${document.source} ${document.documentNumber}]`,
        data: error as Record<string, unknown>,
      });
    }
  }

  async function exportAllRejectedDocuments(environment: environmentType) {
    logger.log({
      operationName: 'exportAllRejectedDocuments',
      msg: `START: Exportation to ${exporterConfig.name}`,
    });

    logger.log({
      operationName: 'exportAllRejectedDocuments',
      msg: `Fetching all rejected documents...`,
    });
    const rejectedDocuments = await documentService.fetchRejectedDocuments();
    logger.log({
      operationName: 'exportAllRejectedDocuments',
      msg: `${rejectedDocuments.length} rejected documents to export`,
    });

    logger.log({
      operationName: 'exportAllRejectedDocuments',
      msg: `Beginning exportation...`,
    });
    for (let index = 0; index < rejectedDocuments.length; index++) {
      logger.log({
        operationName: 'exportAllRejectedDocuments',
        msg: `Exportation of document ${index + 1}/${rejectedDocuments.length}`,
      });
      const document = rejectedDocuments[index];

      await exportRejectedDocument(document, environment);
    }

    logger.log({ operationName: 'exportAllRejectedDocuments', msg: 'DONE' });
  }

  async function exportRejectedDocument(
    document: documentType,
    environment: environmentType,
  ) {
    await exporterConfig.sendDocumentBlockedStatus({
      externalId: document.externalId,
      environment,
    });

    await statisticService.saveStatisticsOfDocument(document, settings);

    await documentService.deleteDocument(document._id);
  }
}
