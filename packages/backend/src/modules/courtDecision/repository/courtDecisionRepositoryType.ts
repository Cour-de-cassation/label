import { courtDecisionType } from '@label/core';

export { courtDecisionRepositoryType };

type courtDecisionRepositoryType = {
  findAll: () => Promise<courtDecisionType[]>;
  insert: (CourtDecision: courtDecisionType) => Promise<{ success: boolean }>;
};
