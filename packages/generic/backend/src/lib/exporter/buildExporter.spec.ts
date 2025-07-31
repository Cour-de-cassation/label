import {
  dateBuilder,
  documentModule,
  settingsModule,
  treatmentModule,
  treatmentType,
  Deprecated,
} from '@label/core';
import { buildDocumentRepository } from '../../modules/document';
import { buildTreatmentRepository } from '../../modules/treatment';
import { buildExporter } from './buildExporter';
import { exporterConfigType } from './exporterConfigType';

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
      const checklist = [
        {
          check_type: 'check',
          message: 'message',
          short_message: 'short message',
          entities: [],
          sentences: [],
          metadata_text: [],
        },
      ];
      const documents = ([
        {
          text: 'Benoit est ingénieur',
          status: 'done',
          updateDate: dateBuilder.daysAgo(5),
          checklist: checklist,
        },
        { status: 'pending' },
        {
          text: 'Romain est designer',
          status: 'done',
          updateDate: dateBuilder.daysAgo(7),
          checklist: checklist,
        },
        {
          status: 'done',
          updateDate: dateBuilder.daysAgo(2),
        },
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
                score: 1,
                source: 'NLP',
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
                score: 1,
                source: 'NLP',
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
              score: 1,
              entityId: 'firstName_Benoit',
              start: 0,
              text: 'Benoit',
              source: 'NLP',
            },
          ],
          order: 1,
          source: 'NLP',
          treatmentDate: '2024-07-12T09:28:27.000Z',
          version: undefined,
          checklist: checklist,
        },
        {
          annotations: [
            {
              category: 'firstName',
              score: 1,
              entityId: 'firstName_Romain',
              start: 0,
              text: 'Romain',
              source: 'NLP',
            },
          ],
          order: 1,
          source: 'NLP',
          treatmentDate: '2024-07-12T09:29:59.000Z',
          version: undefined,
          checklist: checklist,
        },
      ]);
    });
  });
});

function buildFakeExporterConfig(): exporterConfigType & {
  getExportedExternalIds: () => string[];
  getExportedPseudonymizationTexts: () => string[];
  getExportedLabelTreatments: () => Deprecated.LabelTreatment[];
  getLockedExternalIds: () => string[];
} {
  const exportedExternalIds: string[] = [];
  const exportedpseudonymizationTexts: string[] = [];
  const exportedlabelTreatments: Deprecated.LabelTreatment[] = [];
  const lockedExternalIds: string[] = [];

  return {
    name: 'FAKE_EXPORTER',

    async updateDecisionPseudonymisation({
      externalId,
      pseudoText,
      labelTreatments,
    }) {
      exportedExternalIds.push(externalId);
      exportedpseudonymizationTexts.push(pseudoText);
      exportedlabelTreatments.push(...labelTreatments);
    },

    async fetchDecisionByExternalId(externalId) {
      return undefined;
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
