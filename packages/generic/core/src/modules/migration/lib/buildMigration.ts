import { idType } from '../../id';
import { migrationType } from '../migrationType';

export { buildMigration };

function buildMigration(_id: idType): migrationType {
  return {
    _id,
    creationDate: new Date().getTime(),
  };
}
