import { migrationType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customMigrationRepositoryType } from './customMigrationRepositoryType';

export { buildMigrationRepository };

const buildMigrationRepository = buildRepositoryBuilder<
  migrationType,
  customMigrationRepositoryType
>({
  collectionName: 'migrations',
  indexes: [],
  buildCustomRepository: () => ({}),
});
