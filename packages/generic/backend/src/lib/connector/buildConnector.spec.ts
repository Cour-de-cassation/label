import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../modules/document';
import { buildConnector } from './buildConnector';

describe('buildConnector', () => {
  let documentRepository = buildDocumentRepository();

  beforeEach(() => {
    documentRepository = buildDocumentRepository();
  });

  describe('importAllDocuments', () => {
    it('should import all the document fetched by the connector', async () => {
      const fakeConnector = buildFakeConnectorWithNDocuments(5);
      const connector = buildConnector(fakeConnector);

      await connector.importAllDocuments();

      const connectorDocuments = fakeConnector.getAllDocuments();
      const insertedDocuments = await documentRepository.findAll();
      connectorDocuments.forEach((connectorDocument) =>
        expect(
          insertedDocuments.some(
            (insertedDocument) =>
              insertedDocument.documentId === connectorDocument.documentId,
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
    async fetchAllDocuments() {
      return documents;
    },
    async updateDocumentsLoadedStatus() {},
    getAllDocuments() {
      return documents;
    },
  };
}
