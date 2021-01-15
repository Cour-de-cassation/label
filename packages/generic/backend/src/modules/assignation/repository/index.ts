import { dependencyManager } from '@label/core';
import { buildAssignationRepository } from './buildAssignationRepository';
import { buildFakeAssignationRepository } from './buildFakeAssignationRepository';

export { buildRepository as buildAssignationRepository };

const buildRepository = dependencyManager.inject({
  forLocal: buildAssignationRepository,
  forProd: buildAssignationRepository,
  forTest: buildFakeAssignationRepository,
});
