import { courtDecisionType } from '@label/core';
import { buildCourtDecisionRepository } from '../../../modules/courtDecision/repository';
import { oracleApi } from '../api';
import { oracleMapper } from '../mapper';

export { oracleSynchronizer };

const oracleSynchronizer = {
  synchronizeJurinetCourtDecisions,
};

async function synchronizeJurinetCourtDecisions() {
  const jurinetCourtDecisions = await oracleApi.fetchJurinetCourtDecisions();
  const courtDecisions = jurinetCourtDecisions.map(
    oracleMapper.mapJurinetCourtDecisionToCourtDecision,
  );

  await insertCourtDecisions(courtDecisions);
}

async function insertCourtDecisions(courtDecisions: courtDecisionType[]) {
  const courtDecisionRepository = buildCourtDecisionRepository();

  for await (const courtDecision of courtDecisions) {
    await courtDecisionRepository.insert(courtDecision);
  }
}
