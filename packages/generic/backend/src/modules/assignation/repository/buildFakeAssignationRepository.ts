import { assignationType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customAssignationRepositoryType } from './customAssignationRepositoryType';

export { buildFakeAssignationRepository };

const buildFakeAssignationRepository = buildFakeRepositoryBuilder<
  assignationType,
  customAssignationRepositoryType
>({
  buildCustomFakeRepository: () => ({}),
});
