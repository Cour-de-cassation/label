import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { migrationType } from '../migrationType';

export { migrationGenerator };

const migrationGenerator: generatorType<migrationType> = {
  generate: ({ _id, creationDate } = {}) => {
    return {
      _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
      creationDate: creationDate ? creationDate : new Date().getTime(),
    };
  },
};
