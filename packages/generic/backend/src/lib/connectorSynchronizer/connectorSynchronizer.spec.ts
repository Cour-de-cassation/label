import { documentModule } from '@label/core';
import { connectorSynchronizer } from './connectorSynchronizer';
import { buildDocumentRepository } from '../../modules/document';

describe('connectorSynchronizer', () => {
  let documentRepository = buildDocumentRepository();

  beforeEach(() => {
    documentRepository = buildDocumentRepository();
  });

  describe('synchronizeFromConnector', () => {
    it('should synchronize the document fetched by the connector', async () => {
      const fakeConnector = buildFakeConnectorWithNDocuments(5);

      await connectorSynchronizer.synchronizeFromConnector(fakeConnector);

      const connectorDocuments = fakeConnector.getAllDocuments();
      const insertedDocuments = await documentRepository.findAll();
      connectorDocuments.forEach(connectorDocument =>
        expect(
          insertedDocuments.some(
            insertedDocument =>
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
    getAllDocuments() {
      return documents;
    },
  };
}
