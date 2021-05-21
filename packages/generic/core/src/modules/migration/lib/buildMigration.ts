import { migrationType } from '../migrationType';

export { buildMigration };

function buildMigration(migrationFields: Omit<migrationType, 'creationDate'>): migrationType {
  return {
    ...migrationFields,
    creationDate: new Date().getTime(),
  };
}
