import {
  buildAnonymizer,
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
    async exportTreatedDocumentsSince(days: number) {
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
          `Exportation of document ${index + 1}/${
            documentsReadyToExport.length
          }`,
        );
        const document = documentsReadyToExport[index];
        const anonymizer = buildAnonymizer(settings);

        const treatments = await treatmentService.fetchTreatmentsByDocumentId(
          document._id,
        );

        await exporterConfig.sendDocumentPseudonymisationAndTreatments({
          externalId: document.externalId,
          pseudonymizationText: anonymizer.anonymizeDocument(
            document,
            treatmentModule.lib.computeAnnotations(treatments),
          ).text,
          labelTreatments: buildLabelTreatments(treatments),
        });

        await statisticService.saveStatisticsOfDocument(document, settings);

        await documentService.deleteDocument(document._id);
      }

      logger.log(`Exportation done!`);
    },
  };
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
