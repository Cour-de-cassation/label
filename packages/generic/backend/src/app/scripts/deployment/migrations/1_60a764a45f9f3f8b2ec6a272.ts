import { buildMigrationRepository } from '../../../../modules/migration';
import { logger } from '../../../../utils';

export { up, down };

async function up() {
  logger.log({ operationName: 'migration', msg: 'Up: ' });

  const migrationRepository = buildMigrationRepository();

  const migrations = await migrationRepository.findAll();
  const sortedMigrations = [...migrations].sort(
    (migrationA, migrationB) =>
      migrationA.creationDate - migrationB.creationDate,
  );

  await Promise.all(
    sortedMigrations.map((migration, index) =>
      migrationRepository.updateOne(migration._id, {
        order: index,
      }),
    ),
  );
}

async function down() {
  logger.log({ operationName: 'migration', msg: 'Down: ' });

  const migrationRepository = buildMigrationRepository();

  await migrationRepository.deletePropertiesForMany({}, ['order']);
}
