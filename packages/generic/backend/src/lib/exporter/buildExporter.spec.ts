import {
  dateBuilder,
  documentModule,
  settingsModule,
  treatmentModule,
  treatmentType,
} from '@label/core';
import { buildDocumentRepository } from '../../modules/document';
import { buildTreatmentRepository } from '../../modules/treatment';
import { buildExporter } from './buildExporter';
import { exporterConfigType } from './exporterConfigType';
import { LabelTreatment } from 'dbsder-api-types';

/* eslint-disable @typescript-eslint/no-unused-vars */
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
                certaintyScore: 1,
              },
            ],
          },
          documentId: documents[0]._id,
          order: 0,
          lastUpdateDate: 1720776507000,
          source: 'NLP' as treatmentType['source'],
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
                certaintyScore: 1,
              },
            ],
          },
          documentId: documents[2]._id,
          order: 1,
          lastUpdateDate: 1720776599000,
          source: 'NLP' as treatmentType['source'],
        },
      ].map(treatmentModule.generator.generate);
      await Promise.all(documents.map(documentRepository.insert));
      await Promise.all(treatments.map(treatmentRepository.insert));
      const fakeExporterConfig = buildFakeExporterConfig();
      const exporter = buildExporter(fakeExporterConfig, settings);

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
      expect(exportedLabelTreatments.sort()).toEqual([
        {
          annotations: [
            {
              category: 'firstName',
              certaintyScore: 1,
              entityId: 'firstName_Benoit',
              start: 0,
              text: 'Benoit',
            },
          ],
          order: 1,
          source: 'NLP',
          treatmentDate: '2024-07-12T09:28:27.000Z',
          version: undefined,
        },
        {
          annotations: [
            {
              category: 'firstName',
              certaintyScore: 1,
              entityId: 'firstName_Romain',
              start: 0,
              text: 'Romain',
            },
          ],
          order: 1,
          source: 'NLP',
          treatmentDate: '2024-07-12T09:29:59.000Z',
          version: undefined,
        },
      ]);
    });
  });
});

function buildFakeExporterConfig(): exporterConfigType & {
  getExportedExternalIds: () => string[];
  getExportedPseudonymizationTexts: () => string[];
  getExportedLabelTreatments: () => LabelTreatment[];
  getLockedExternalIds: () => string[];
} {
  const exportedExternalIds: string[] = [];
  const exportedpseudonymizationTexts: string[] = [];
  const exportedlabelTreatments: LabelTreatment[] = [];
  const lockedExternalIds: string[] = [];

  return {
    name: 'FAKE_EXPORTER',

    async sendDocumentPseudonymisationAndTreatments({
      externalId,
      pseudoText,
      labelTreatments,
    }) {
      exportedExternalIds.push(externalId);
      exportedpseudonymizationTexts.push(pseudoText);
      exportedlabelTreatments.push(...labelTreatments);
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

    getLockedExternalIds() {
      return lockedExternalIds;
    },
  };
}
