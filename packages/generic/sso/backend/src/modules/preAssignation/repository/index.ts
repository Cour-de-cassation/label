import { dependencyManager } from '../../../utils';
import { buildPreAssignationRepository } from './buildPreAssignationRepository';
import { buildFakePreAssignationRepository } from './buildFakePreAssignationRepository';

export { buildRepository as buildPreAssignationRepository };

const buildRepository = dependencyManager.inject({
  forLocal: buildPreAssignationRepository,
  forProd: buildPreAssignationRepository,
  forTest: buildFakePreAssignationRepository,
});
