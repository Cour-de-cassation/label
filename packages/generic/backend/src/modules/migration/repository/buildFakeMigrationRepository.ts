import { migrationType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customMigrationRepositoryType } from './customMigrationRepositoryType';

export { buildFakeMigrationRepository };

const buildFakeMigrationRepository = buildFakeRepositoryBuilder<
  migrationType,
  customMigrationRepositoryType
>({
  collectionName: 'migrations',
  buildCustomFakeRepository: () => ({}),
});
