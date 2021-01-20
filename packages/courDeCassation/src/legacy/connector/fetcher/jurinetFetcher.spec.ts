import { jurinetFetcher } from './jurinetFetcher';
import { jurinetFakeServer } from '../test/server';

describe('jurinetFetcher', () => {
  beforeEach(() => {
    jurinetFakeServer.reinitialize();
  });

  describe('fetchAllDocuments', () => {
    it('should fetch all the court decision as documents from jurinet', async () => {
      const documents = await jurinetFetcher.fetchAllDocuments();

      const jurinetCourtDecisions = jurinetFakeServer.getJurinetCourtDecisions();
      jurinetCourtDecisions.forEach(jurinetCourtDecision =>
        expect(
          documents.some(
            document =>
              document.documentId === parseInt(jurinetCourtDecision.oracleId),
          ),
        ),
      );
    });
  });
});
