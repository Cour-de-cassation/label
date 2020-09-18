import { courtDecisionType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customCourtDecisionRepositoryType } from './customCourtDecisionRepositoryType';

export { buildCourtDecisionRepository };

const buildCourtDecisionRepository = buildRepositoryBuilder<
  courtDecisionType,
  customCourtDecisionRepositoryType
>({ collectionName: 'courtDecisions', buildCustomRepository: () => ({}) });
