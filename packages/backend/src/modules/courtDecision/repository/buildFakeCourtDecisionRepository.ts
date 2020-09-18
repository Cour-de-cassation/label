import { courtDecisionType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customCourtDecisionRepositoryType } from './customCourtDecisionRepositoryType';

export { buildFakeCourtDecisionRepository };

const buildFakeCourtDecisionRepository = buildFakeRepositoryBuilder<
  courtDecisionType,
  customCourtDecisionRepositoryType
>({ buildCustomFakeRepository: () => ({}) });
