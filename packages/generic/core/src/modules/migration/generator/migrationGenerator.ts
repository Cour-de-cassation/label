import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { migrationType } from '../migrationType';

export { migrationGenerator };

const migrationGenerator: generatorType<migrationType> = {
  generate: ({ _id, creationDate, order } = {}) => {
    return {
      _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
      order: order ? order : 0,
      creationDate: creationDate ? creationDate : new Date().getTime(),
    };
  },
};
