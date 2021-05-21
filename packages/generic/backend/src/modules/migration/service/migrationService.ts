import { migrationModule, migrationType } from '@label/core';
import { buildMigrationRepository } from '../../../modules/migration';

export { migrationService };

const migrationService = {
  createOne,
  deleteOne,
  fetchAll,
  fetchLastOne,
};

async function deleteOne(_id: migrationType['_id']) {
  const migrationRepository = buildMigrationRepository();

  return migrationRepository.deleteById(_id);
}

async function fetchAll() {
  const migrationRepository = buildMigrationRepository();

  return migrationRepository.findAll();
}

async function fetchLastOne() {
  const migrations = await fetchAll();
  if (migrations.length === 0) {
    return undefined;
  }
  const sortedMigrations = migrations.sort(
    (migrationA, migrationB) => migrationB.order - migrationA.order,
  );
  return sortedMigrations[0];
}

async function createOne({
  _id,
  order,
}: {
  _id: migrationType['_id'];
  order: migrationType['order'];
}) {
  const migrationRepository = buildMigrationRepository();

  const migration = migrationModule.lib.buildMigration({ _id, order });
  return migrationRepository.insert(migration);
}
