import { range } from 'lodash';
import { dateBuilder, documentType } from '@label/core';
import { buildDocumentRepository } from '../../modules/document';
import { buildConnector } from './buildConnector';
import { buildFakeConnectorWithNDecisions } from './buildFakeConnector';

describe('buildConnector', () => {
  let documentRepository = buildDocumentRepository();

  beforeEach(() => {
    documentRepository = buildDocumentRepository();
  });

  describe('importAllDocumentsSince', () => {
    it('should import all the document fetched by the connector', async () => {
      const sourceIds = range(5).map(() => Math.floor(Math.random() * 10000));
      const fakeConnector = await buildFakeConnectorWithNDecisions(
        sourceIds.map((sourceId, index) => {
          const dateDecision = new Date();
          dateDecision.setTime(dateBuilder.daysAgo(index * 7));
          return {
            sourceId,
            dateDecision: dateDecision.toDateString(),
            sourceName: 'jurinet',
          };
        }),
      );
      const connector = buildConnector(fakeConnector);

      await connector.importDocumentsSince(10);

      const insertedDocuments = await documentRepository.findAll();
      expect(insertedDocuments.length).toBe(2);
      [sourceIds[0], sourceIds[1]].forEach((sourceId) =>
        expect(
          insertedDocuments.some(
            (insertedDocument) => insertedDocument.documentNumber === sourceId,
          ),
        ),
      );
    });

    describe('importAllDocumentsSinceDateCreation', () => {
      it('should import all the document fetched by the connector', async () => {
        const sourceIds = range(5).map(() => Math.floor(Math.random() * 10000));
        const fakeConnector = await buildFakeConnectorWithNDecisions(
          sourceIds.map((sourceId, index) => {
            const dateCreation = new Date();
            dateCreation.setTime(dateBuilder.daysAgo(index * 7));
            return {
              sourceId,
              dateCreation: dateCreation.toDateString(),
              sourceName: 'jurinet',
            };
          }),
        );
        const connector = buildConnector(fakeConnector);

        await connector.importDocumentsSinceDateCreation(10);

        const insertedDocuments = await documentRepository.findAll();
        expect(insertedDocuments.length).toBe(2);
        [sourceIds[0], sourceIds[1]].forEach((sourceId) =>
          expect(
            insertedDocuments.some(
              (insertedDocument) =>
                insertedDocument.documentNumber === sourceId,
            ),
          ),
        );
      });
    });
  });

  describe('importNewDocuments', () => {
    it('should import documents fetched by the connector', async () => {
      const sourceIds = range(5).map(() => Math.floor(Math.random() * 10000));
      const fakeConnector = await buildFakeConnectorWithNDecisions(
        sourceIds.map((sourceId, index) => {
          const dateDecision = new Date();
          dateDecision.setTime(dateBuilder.daysAgo(index * 7));
          return {
            sourceId,
            dateDecision: dateDecision.toDateString(),
            sourceName: 'jurica',
          };
        }),
      );
      const connector = buildConnector(fakeConnector);

      await connector.importNewDocuments(3, 5);

      const insertedDocuments = await documentRepository.findAll();
      expect(insertedDocuments.length).toBe(3);
      [sourceIds[0], sourceIds[1], sourceIds[2]].forEach((sourceId) =>
        expect(
          insertedDocuments.some(
            (insertedDocument) => insertedDocument.documentNumber === sourceId,
          ),
        ),
      );
    });
  });

  describe('autoImportDocuments', () => {
    it('should not import documents', async () => {
      const sourceIds = range(5).map(() => Math.floor(Math.random() * 10000));
      const fakeConnector = await buildFakeConnectorWithNDecisions(
        sourceIds.map((sourceId) => ({ sourceId, sourceName: 'jurica' })),
      );
      const connector = buildConnector(fakeConnector);
      const initialCourtDecisions = fakeConnector.fetchAllCourtDecisions();
      const initialDocuments = [] as documentType[];
      for (const decision of initialCourtDecisions) {
        initialDocuments.push(
          await fakeConnector.mapCourtDecisionToDocument(decision),
        );
      }
      await documentRepository.insertMany(initialDocuments);
      await documentRepository.updateMany({}, { status: 'free' });

      await connector.autoImportDocumentsFromSder(4, 5);

      const finalDocuments = await documentRepository.findAll();
      expect(sourceIds.sort()).toEqual(
        finalDocuments.map(({ documentNumber }) => documentNumber).sort(),
      );
    });

    it('should import 9 documents', async () => {
      const sourceIds = range(10).map(() => Math.floor(Math.random() * 10000));
      const fakeConnector = await buildFakeConnectorWithNDecisions(
        sourceIds.map((sourceId, index) => {
          const dateDecision = new Date();
          dateDecision.setTime(dateBuilder.daysAgo(index * 31));
          return {
            sourceId,
            dateDecision: dateDecision.toDateString(),
            sourceName: 'jurica',
          };
        }),
      );
      const connector = buildConnector(fakeConnector);
      const initialCourtDecisions = fakeConnector
        .fetchAllCourtDecisions()
        .slice(0, 5);
      const initialDocuments = [] as documentType[];
      for (const decision of initialCourtDecisions) {
        initialDocuments.push(
          await fakeConnector.mapCourtDecisionToDocument(decision),
        );
      }
      await documentRepository.insertMany(initialDocuments);
      await documentRepository.updateMany({}, { status: 'free' });

      await connector.autoImportDocumentsFromSder(6, 4);

      const finalDocuments = await documentRepository.findAll();
      expect(finalDocuments.length).toBe(9);
    });
  });

  describe('importChainedDocumentsFromSder', () => {
    it('should not import documents', async () => {
      const sourceIds = range(5).map(() => Math.floor(Math.random() * 10000));
      const fakeConnector = await buildFakeConnectorWithNDecisions(
        sourceIds.map((sourceId) => ({ sourceId, sourceName: 'jurica' })),
      );
      const connector = buildConnector(fakeConnector);
      const initialCourtDecisions = fakeConnector.fetchAllCourtDecisions();
      const initialDocuments = [] as documentType[];
      for (const decision of initialCourtDecisions) {
        initialDocuments.push(
          await fakeConnector.mapCourtDecisionToDocument(decision),
        );
      }
      await documentRepository.insertMany(initialDocuments);
      await documentRepository.updateMany({}, { status: 'free' });

      await connector.importChainedDocumentsFromSder(4, 5);

      const finalDocuments = await documentRepository.findAll();
      expect(sourceIds.sort()).toEqual(
        finalDocuments.map(({ documentNumber }) => documentNumber).sort(),
      );
    });

    it('should import 9 documents', async () => {
      const sourceIds = range(10).map(() => Math.floor(Math.random() * 10000));
      const fakeConnector = await buildFakeConnectorWithNDecisions(
        sourceIds.map((sourceId, index) => {
          const dateDecision = new Date();
          dateDecision.setTime(dateBuilder.daysAgo(index * 31));
          return {
            sourceId,
            dateDecision: dateDecision.toDateString(),
            sourceName: 'jurica',
          };
        }),
      );
      const connector = buildConnector(fakeConnector);
      const initialCourtDecisions = fakeConnector
        .fetchAllCourtDecisions()
        .slice(0, 5);
      const initialDocuments = [] as documentType[];
      for (const decision of initialCourtDecisions) {
        initialDocuments.push(
          await fakeConnector.mapCourtDecisionToDocument(decision),
        );
      }
      await documentRepository.insertMany(initialDocuments);
      await documentRepository.updateMany({}, { status: 'free' });

      await connector.importChainedDocumentsFromSder(6, 4);

      const finalDocuments = await documentRepository.findAll();
      expect(finalDocuments.length).toBe(9);
    });
  });
});
