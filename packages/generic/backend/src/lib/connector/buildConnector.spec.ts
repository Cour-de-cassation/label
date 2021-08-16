import { documentModule, documentType, idModule } from '@label/core';
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
      const fakeConnector = await buildFakeConnectorWithNDecisions(5);
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

  describe('deleteJuricaDocumentsFromLabelDb', () => {
    it('should delete all the jurica document from label db', async () => {
      const fakeConnector = await buildFakeConnectorWithNDecisions(5, {
        labelStatus: 'loaded',
        sourceName: 'jurica',
      });
      const connector = buildConnector(fakeConnector);

      await connector.deleteJuricaDocumentsFromLabelDb();

      const updatedCourtDecisions = await fakeConnector.fetchAllCourtDecisionsBetween();
      const documents = await documentRepository.findAll();
      updatedCourtDecisions.forEach((courtDecision) =>
        expect(courtDecision.labelStatus).toBe('toBeTreated'),
      );
      expect(documents).toEqual([]);
    });
  });

  it('should leave all the jurinet documents in label db', async () => {
    const fakeConnector = await buildFakeConnectorWithNDecisions(5, {
      labelStatus: 'loaded',
      sourceName: 'jurinet',
    });
    const connector = buildConnector(fakeConnector);

    await connector.deleteJuricaDocumentsFromLabelDb();

    const updatedCourtDecisions = await fakeConnector.fetchAllCourtDecisionsBetween();
    const documents = await documentRepository.findAll();
    updatedCourtDecisions.forEach((courtDecision) =>
      expect(courtDecision.labelStatus).toBe('loaded'),
    );
    expect(documents.length).toBe(5);
  });
});

async function buildFakeConnectorWithNDecisions(
  n: number,
  courtDecisionFields?: {
    sourceName?: decisionType['sourceName'];
    labelStatus?: decisionType['labelStatus'];
  },
) {
  let courtDecisions = [...Array(n).keys()].map(() =>
    decisionModule.lib.generateDecision({
      sourceName: courtDecisionFields?.sourceName,
      labelStatus: courtDecisionFields?.labelStatus,
    }),
  );
  const documents = courtDecisions.map(
    fakeSderMapper.mapCourtDecisionToDocument,
  );
  const documentRepository = buildDocumentRepository();
  await documentRepository.insertMany(documents);

  return {
    name: 'FAKE_CONNECTOR',
    async fetch() {
      return courtDecisions;
    },
    async fetchCourtDecisionBySourceIdAndSourceName({
      sourceId,
      sourceName,
    }: {
      sourceId: number;
      sourceName: string;
    }) {
      return courtDecisions.find(
        (courtDecision) =>
          courtDecision.sourceId === sourceId &&
          courtDecision.sourceName === sourceName,
      );
    },
    async fetchAllCourtDecisionsBetween() {
      return courtDecisions;
    },
    async updateDocumentsLoadedStatus(documents: documentType[]) {
      courtDecisions = courtDecisions.map((courtDecision) => {
        if (
          documents.some((document) =>
            idModule.lib.equalId(
              idModule.lib.buildId(document.externalId),
              courtDecision._id,
            ),
          )
        ) {
          return { ...courtDecision, labelStatus: 'loaded' };
        }
        return courtDecision;
      });
    },
    async updateDocumentsToBeTreatedStatus(documents: documentType[]) {
      courtDecisions = courtDecisions.map((courtDecision) => {
        if (
          documents.some((document) =>
            idModule.lib.equalId(
              idModule.lib.buildId(document.externalId),
              courtDecision._id,
            ),
          )
        ) {
          return { ...courtDecision, labelStatus: 'toBeTreated' };
        }
        return courtDecision;
      });
    },
    getAllDocuments() {
      return documents;
    },
    mapCourtDecisionToDocument: fakeSderMapper.mapCourtDecisionToDocument,
  };
}

const fakeSderMapper = {
  mapCourtDecisionToDocument(courtDecision: decisionType) {
    return documentModule.generator.generate({
      status: 'free',
      externalId: idModule.lib.convertToString(courtDecision._id),
      documentNumber: courtDecision.sourceId,
      source: courtDecision.sourceName,
    });
  },
};
