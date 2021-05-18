import { idType, migrationModule } from '@label/core';
import { buildMigrationRepository } from '../../../modules/migration';

export { migrationService };

const migrationService = {
  createOne,
  fetchAll,
};

async function fetchAll() {
  const migrationRepository = buildMigrationRepository();

  return migrationRepository.findAll();
}

async function createOne(_id: idType) {
  const migrationRepository = buildMigrationRepository();

  const migration = migrationModule.lib.buildMigration(_id);
  return migrationRepository.insert(migration);
}
