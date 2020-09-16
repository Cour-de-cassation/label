import { courtDecisionType } from '@label/core';
import { fakeRepositoryType } from '../../../tests';
import { courtDecisionRepositoryType } from './courtDecisionRepositoryType';

export { buildFakeCourtDecisionRepository };

let collection: courtDecisionType[] = [];

function buildFakeCourtDecisionRepository(): fakeRepositoryType<
  courtDecisionRepositoryType
> {
  return {
    findAll,
    insert,
    reinitialize: () => (collection = []),
  };

  async function findAll() {
    return collection;
  }

  async function insert(courtDecision: courtDecisionType) {
    collection.push(courtDecision);
    return { success: true };
  }
}
