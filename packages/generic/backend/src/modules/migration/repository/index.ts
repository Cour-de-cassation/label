import { dependencyManager } from '../../../utils';
import { buildFakeMigrationRepository } from './buildFakeMigrationRepository';
import { buildMigrationRepository } from './buildMigrationRepository';

export { buildRepository as buildMigrationRepository };

const buildRepository = dependencyManager.inject({
  forLocal: buildMigrationRepository,
  forProd: buildMigrationRepository,
  forTest: buildFakeMigrationRepository,
});
