import { oracle } from './oracle';
import { oracleTestServer } from './test';
import { buildCourtDecisionRepository } from '../../modules/courtDecision';

describe('oracle', () => {
  let courtDecisionRepository = buildCourtDecisionRepository();

  beforeEach(() => {
    courtDecisionRepository = buildCourtDecisionRepository();
    oracleTestServer.reinitialize();
  });

  describe('synchronizeAllCourtDecisions', () => {
    it('should synchronize the jurinet court decisions', async () => {
      await oracle.synchronizeAllCourtDecisions();

      const jurinetCourtDecisions = oracleTestServer.getJurinetCourtDecisions();
      const courtDecisions = await courtDecisionRepository.findAll();
      jurinetCourtDecisions.forEach(jurinetCourtDecision =>
        expect(
          courtDecisions.some(
            courtDecision =>
              courtDecision.oracleId === jurinetCourtDecision.oracleId,
          ),
        ),
      );
    });
  });
});
