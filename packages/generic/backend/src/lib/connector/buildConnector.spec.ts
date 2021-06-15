import { documentModule } from '@label/core';
import { decisionModule, decisionType } from 'sder';
import { buildDocumentRepository } from '../../modules/document';
import { buildConnector } from './buildConnector';

describe('buildConnector', () => {
  let documentRepository = buildDocumentRepository();

  beforeEach(() => {
    documentRepository = buildDocumentRepository();
  });

  describe('importAllDocumentsSince', () => {
    it('should import all the document fetched by the connector', async () => {
      const fakeConnector = buildFakeConnectorWithNDecisions(5);
      const connector = buildConnector(fakeConnector);

      await connector.importDocumentsSince(10);

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

function buildFakeConnectorWithNDecisions(n: number) {
  const courtDecisions = [...Array(n).keys()].map(() =>
    decisionModule.lib.generateDecision(),
  );
  const documents = courtDecisions.map(
    fakeSderMapper.mapCourtDecisionToDocument,
  );

  return {
    name: 'FAKE_CONNECTOR',
    async fetchAllCourtDecisionsBetween() {
      return courtDecisions;
    },
    async updateDocumentsLoadedStatus() {},
    getAllDocuments() {
      return documents;
    },
    mapCourtDecisionToDocument: fakeSderMapper.mapCourtDecisionToDocument,
  };
}

const fakeSderMapper = {
  mapCourtDecisionToDocument(courtDecision: decisionType) {
    return documentModule.generator.generate({
      documentNumber: courtDecision.sourceId,
    });
  },
};
