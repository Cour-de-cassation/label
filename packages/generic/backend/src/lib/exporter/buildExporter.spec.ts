import {
  dateBuilder,
  documentModule,
  settingsModule,
  treatmentModule,
} from '@label/core';
import { buildDocumentRepository } from '../../modules/document';
import { buildTreatmentRepository } from '../../modules/treatment';
import { buildExporter } from './buildExporter';
import { exporterConfigType, labelTreatmentsType } from './exporterConfigType';

describe('buildExporter', () => {
  const documentRepository = buildDocumentRepository();
  const treatmentRepository = buildTreatmentRepository();
  const settings = settingsModule.lib.buildSettings({
    firstName: { anonymization: '[FIRST_NAME %d]' },
  });

  describe('exportTreatedDocumentsSince', () => {
    it('should export all the ready document since the given days fetched by the exporter', async () => {
      const days = 4;
      const documents = ([
        {
          text: 'Benoit est ingénieur',
          status: 'done',
          updateDate: dateBuilder.daysAgo(5),
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
                certaintyScore: undefined,
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
                certaintyScore: undefined,
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

      await exporter.exportTreatedDocumentsSince(days);

      const exportedExternalIds = fakeExporterConfig.getExportedExternalIds();
      const exportedPseudonymizationTexts = fakeExporterConfig.getExportedPseudonymizationTexts();
      const exportedLabelTreatments = fakeExporterConfig.getExportedLabelTreatments();
      expect(exportedExternalIds.sort()).toEqual(
        [documents[0].externalId, documents[2].externalId].sort(),
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
  getExportedExternalIds: () => string[];
  getExportedPseudonymizationTexts: () => string[];
  getExportedLabelTreatments: () => labelTreatmentsType[];
} {
  const exportedExternalIds: string[] = [];
  const exportedpseudonymizationTexts: string[] = [];
  const exportedlabelTreatments: labelTreatmentsType[] = [];

  return {
    name: 'FAKE_EXPORTER',

    async sendDocumentPseudonymisationAndTreatments({
      externalId,
      pseudonymizationText,
      labelTreatments,
    }) {
      exportedExternalIds.push(externalId);
      exportedpseudonymizationTexts.push(pseudonymizationText);
      exportedlabelTreatments.push(labelTreatments);
    },

    getExportedExternalIds() {
      return exportedExternalIds;
    },

    getExportedPseudonymizationTexts() {
      return exportedpseudonymizationTexts;
    },

    getExportedLabelTreatments() {
      return exportedlabelTreatments;
    },
  };
}
