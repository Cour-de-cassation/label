import { courtDecisionType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../tests';
import { courtDecisionRepositoryType } from './courtDecisionRepositoryType';

export { buildFakeCourtDecisionRepository };

const buildFakeCourtDecisionRepository = buildFakeRepositoryBuilder<
  courtDecisionType,
  courtDecisionRepositoryType
>(collection => {
  return {
    findAll,
    insert,
  };

  async function findAll() {
    return collection;
  }

  async function insert(courtDecision: courtDecisionType) {
    collection.push(courtDecision);
    return { success: true };
  }
});
