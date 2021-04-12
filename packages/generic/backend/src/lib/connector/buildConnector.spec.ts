import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../modules/document';
import { buildConnector } from './buildConnector';

describe('buildConnector', () => {
  let documentRepository = buildDocumentRepository();

  beforeEach(() => {
    documentRepository = buildDocumentRepository();
  });

  describe('importAllDocumentsSince', () => {
    it('should import all the document fetched by the connector', async () => {
      const fakeConnector = buildFakeConnectorWithNDocuments(5);
      const connector = buildConnector(fakeConnector);

      await connector.importAllDocumentsSince(10);

      const connectorDocuments = fakeConnector.getAllDocuments();
      const insertedDocuments = await documentRepository.findAll();
      connectorDocuments.forEach((connectorDocument) =>
        expect(
          insertedDocuments.some(
            (insertedDocument) =>
              insertedDocument.documentNumber ===
              connectorDocument.documentNumber,
          ),
        ),
      );
    });
  });
});

function buildFakeConnectorWithNDocuments(n: number) {
  const documents = [...Array(n).keys()].map(() =>
    documentModule.generator.generate(),
  );

  return {
    name: 'FAKE_CONNECTOR',
    async fetchAllDocumentsSince() {
      return documents;
    },
    async updateDocumentsLoadedStatus() {},
    getAllDocuments() {
      return documents;
    },
  };
}
