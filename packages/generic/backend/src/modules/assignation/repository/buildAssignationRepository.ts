import { assignationType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customAssignationRepositoryType } from './customAssignationRepositoryType';
export { buildAssignationRepository };

const buildAssignationRepository = buildRepositoryBuilder<
  assignationType,
  customAssignationRepositoryType
>({
  collectionName: 'assignations',
  buildCustomRepository: () => ({}),
});
