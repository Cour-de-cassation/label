import { dependencyManager } from '../../../utils';
import { buildFakeUserRepository } from './buildFakeUserRepository';
import { buildUserRepository } from './buildUserRepository';

export { buildRepository as buildUserRepository };

const buildRepository = dependencyManager.inject({
  forLocal: buildUserRepository,
  forProd: buildUserRepository,
  forTest: buildFakeUserRepository,
});
