import { oracle } from './oracle';
import { oracleTestServer } from './test';
import { buildDocumentRepository } from '../../modules/document';

describe('oracle', () => {
  let courtDecisionRepository = buildDocumentRepository();

  beforeEach(() => {
    courtDecisionRepository = buildDocumentRepository();
    oracleTestServer.reinitialize();
  });

  describe('synchronizeAllCourtDecisions', () => {
    it('should synchronize the jurinet court decisions', async () => {
      await oracle.synchronizeAllCourtDecisions();

      const jurinetCourtDecisions = oracleTestServer.getJurinetCourtDecisions();
      const courtDecisions = await courtDecisionRepository.findAll();
      jurinetCourtDecisions.forEach((jurinetCourtDecision) =>
        expect(
          courtDecisions.some(
            (courtDecision) =>
              courtDecision.documentId === jurinetCourtDecision.oracleId,
          ),
        ),
      );
    });
  });
});
