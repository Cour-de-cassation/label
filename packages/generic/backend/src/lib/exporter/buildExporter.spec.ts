import { documentModule, settingsModule, treatmentModule } from '@label/core';
import { buildDocumentRepository } from '../../modules/document';
import { buildTreatmentRepository } from '../../modules/treatment';
import { dateBuilder } from '../../utils';
import { buildExporter } from './buildExporter';
import { exporterConfigType, labelTreatmentsType } from './exporterConfigType';

describe('buildExporter', () => {
  const documentRepository = buildDocumentRepository();
  const treatmentRepository = buildTreatmentRepository();
  const settings = settingsModule.lib.buildSettings({
    firstName: { anonymization: '[FIRST_NAME %d]' },
  });

  describe('exportTreatedDocuments', () => {
    it('should export all the ready document fetched by the exporter', async () => {
      const documents = ([
        {
          text: 'Benoit est ingénieur',
          status: 'done',
          updateDate: dateBuilder.daysAgo(4),
        },
        { status: 'pending' },
        {
          text: 'Romain est designer',
          status: 'done',
          updateDate: dateBuilder.daysAgo(7),
        },
        { status: 'done', updateDate: dateBuilder.daysAgo(2) },
      ] as const).map(documentModule.generator.generate);
      const treatments = [
        {
          annotationsDiff: {
            before: [],
            after: [
              {
                category: 'firstName',
                entityId: 'firstName_Benoit',
                start: 0,
                text: 'Benoit',
              },
            ],
          },
          documentId: documents[0]._id,
          order: 0,
        },
        {
          annotationsDiff: {
            before: [],
            after: [
              {
                category: 'firstName',
                entityId: 'firstName_Romain',
                start: 0,
                text: 'Romain',
              },
            ],
          },
          documentId: documents[2]._id,
          order: 0,
        },
      ].map(treatmentModule.generator.generate);
      await Promise.all(documents.map(documentRepository.insert));
      await Promise.all(treatments.map(treatmentRepository.insert));
      const fakeExporterConfig = buildFakeExporterConfig();
      const exporter = buildExporter(settings, fakeExporterConfig);

      await exporter.exportTreatedDocuments();

      const exportedDocumentIds = fakeExporterConfig.getExportedDocumentNumbers();
      const exportedPseudonymizationTexts = fakeExporterConfig.getExportedPseudonymizationTexts();
      const exportedLabelTreatments = fakeExporterConfig.getExportedLabelTreatments();
      expect(exportedDocumentIds.sort()).toEqual(
        [documents[0].documentNumber, documents[2].documentNumber].sort(),
      );
      expect(exportedPseudonymizationTexts.sort()).toEqual(
        ['[FIRST_NAME 1] est ingénieur', '[FIRST_NAME 1] est designer'].sort(),
      );
      expect(exportedLabelTreatments.sort()).toEqual(
        [
          [
            {
              annotations: [
                {
                  category: 'firstName',
                  entityId: 'firstName_Benoit',
                  start: 0,
                  text: 'Benoit',
                },
              ],
              source: 'NLP',
              order: 1,
            },
          ],
          [
            {
              annotations: [
                {
                  category: 'firstName',
                  entityId: 'firstName_Romain',
                  start: 0,
                  text: 'Romain',
                },
              ],
              source: 'NLP',
              order: 1,
            },
          ],
        ].sort(),
      );
    });
  });
});

function buildFakeExporterConfig(): exporterConfigType & {
  getExportedDocumentNumbers: () => number[];
  getExportedPseudonymizationTexts: () => string[];
  getExportedLabelTreatments: () => labelTreatmentsType[];
} {
  const exportedDocumentNumbers: number[] = [];
  const exportedpseudonymizationTexts: string[] = [];
  const exportedlabelTreatments: labelTreatmentsType[] = [];

  return {
    name: 'FAKE_EXPORTER',

    async sendDocumentPseudonymisationAndTreatments({
      documentNumber,
      pseudonymizationText,
      labelTreatments,
    }) {
      exportedDocumentNumbers.push(documentNumber);
      exportedpseudonymizationTexts.push(pseudonymizationText);
      exportedlabelTreatments.push(labelTreatments);
    },

    getExportedDocumentNumbers() {
      return exportedDocumentNumbers;
    },

    getExportedPseudonymizationTexts() {
      return exportedpseudonymizationTexts;
    },

    getExportedLabelTreatments() {
      return exportedlabelTreatments;
    },
  };
}
