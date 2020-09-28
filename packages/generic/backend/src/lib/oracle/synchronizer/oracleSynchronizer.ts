import { courtDecisionType } from '@label/core';
import { logger } from '../../../utils';
import { buildDocumentRepository } from '../../../modules/courtDecision/repository';
import { oracleApi } from '../api';
import { oracleMapper } from '../mapper';

export { oracleSynchronizer };

const oracleSynchronizer = {
  synchronizeJurinetCourtDecisions,
};

async function synchronizeJurinetCourtDecisions() {
  logger.log(`Fetching Jurinet court decisions...`);
  const jurinetCourtDecisions = await oracleApi.fetchJurinetCourtDecisions();
  logger.log(
    `${jurinetCourtDecisions.length} Jurinet court decisions fetched!`,
  );

  const courtDecisions = jurinetCourtDecisions.map(
    oracleMapper.mapJurinetCourtDecisionToCourtDecision,
  );

  logger.log(`Insertion into the database...`);
  await insertCourtDecisions(courtDecisions);
  logger.log(`Insertion done!`);
}

async function insertCourtDecisions(courtDecisions: courtDecisionType[]) {
  const courtDecisionRepository = buildDocumentRepository();

  /*
  for await (const courtDecision of courtDecisions) {
    await courtDecisionRepository.insert(courtDecision);
  }
  */
}
