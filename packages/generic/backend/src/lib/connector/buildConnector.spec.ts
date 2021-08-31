import { range } from 'lodash';
import { dateBuilder } from '@label/core';
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
          const dateCreation = new Date();
          dateCreation.setTime(dateBuilder.daysAgo(index * 7));
          return { sourceId, dateCreation: dateCreation.toDateString() };
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
  });

  describe('importNewDocuments', () => {
    it('should import documents fetched by the connector', async () => {
      const sourceIds = range(5).map(() => Math.floor(Math.random() * 10000));
      const fakeConnector = await buildFakeConnectorWithNDecisions(
        sourceIds.map((sourceId, index) => {
          const dateCreation = new Date();
          dateCreation.setTime(dateBuilder.daysAgo(index * 7));
          return { sourceId, dateCreation: dateCreation.toDateString() };
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
        sourceIds.map((sourceId) => ({ sourceId })),
      );
      const connector = buildConnector(fakeConnector);
      const initialCourtDecisions = await fakeConnector.fetchAllCourtDecisions();
      const initialDocuments = initialCourtDecisions.map(
        fakeConnector.mapCourtDecisionToDocument,
      );
      await documentRepository.insertMany(initialDocuments);
      await documentRepository.updateMany({}, { status: 'free' });

      await connector.autoImportDocumentsFromSder(4, 5);

      const finalDocuments = await documentRepository.findAll();
      expect(sourceIds.sort()).toEqual(
        finalDocuments.map(({ documentNumber }) => documentNumber).sort(),
      );
    });

    it('should import documents', async () => {
      const sourceIds = range(10).map(() => Math.floor(Math.random() * 10000));
      const fakeConnector = await buildFakeConnectorWithNDecisions(
        sourceIds.map((sourceId, index) => {
          const dateCreation = new Date();
          dateCreation.setTime(dateBuilder.daysAgo(index * 31));
          return { sourceId, dateCreation: dateCreation.toDateString() };
        }),
      );
      const connector = buildConnector(fakeConnector);
      const initialCourtDecisions = await fakeConnector.fetchAllCourtDecisions();
      const initialDocuments = initialCourtDecisions
        .slice(0, 5)
        .map(fakeConnector.mapCourtDecisionToDocument);
      await documentRepository.insertMany(initialDocuments);
      await documentRepository.updateMany({}, { status: 'free' });

      await connector.autoImportDocumentsFromSder(6, 4);

      const finalDocuments = await documentRepository.findAll();
      expect(finalDocuments.length).toBe(9);
    });
  });

  describe('deleteJuricaDocumentsFromLabelDb', () => {
    it('should delete all the jurica document from label db', async () => {
      const fakeConnector = await buildFakeConnectorWithNDecisions(
        range(5).map(() => ({
          labelStatus: 'loaded',
          sourceName: 'jurica',
        })),
      );
      const connector = buildConnector(fakeConnector);
      const initialCourtDecisions = await fakeConnector.fetchAllCourtDecisions();
      await documentRepository.insertMany(
        initialCourtDecisions.map(fakeConnector.mapCourtDecisionToDocument),
      );
      await documentRepository.updateMany({}, { status: 'free' });

      await connector.deleteJuricaDocumentsFromLabelDb();

      const updatedCourtDecisions = await fakeConnector.fetchAllCourtDecisions();
      const documents = await documentRepository.findAll();
      updatedCourtDecisions.forEach((courtDecision) =>
        expect(courtDecision.labelStatus).toBe('toBeTreated'),
      );
      expect(documents).toEqual([]);
    });

    it('should leave all the jurinet documents in label db', async () => {
      const fakeConnector = await buildFakeConnectorWithNDecisions(
        range(5).map(() => ({
          labelStatus: 'loaded',
          sourceName: 'jurinet',
        })),
      );
      const connector = buildConnector(fakeConnector);
      const initialCourtDecisions = await fakeConnector.fetchAllCourtDecisions();
      await documentRepository.insertMany(
        initialCourtDecisions.map(fakeConnector.mapCourtDecisionToDocument),
      );
      await documentRepository.updateMany({}, { status: 'free' });

      await connector.deleteJuricaDocumentsFromLabelDb();

      const updatedCourtDecisions = await fakeConnector.fetchAllCourtDecisions();
      const documents = await documentRepository.findAll();
      updatedCourtDecisions.forEach((courtDecision) =>
        expect(courtDecision.labelStatus).toBe('loaded'),
      );
      expect(documents.length).toBe(5);
    });
  });
});
