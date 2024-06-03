import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { preAssignationType } from '../preAssignationType';

export { preAssignationGenerator };

const preAssignationGenerator: generatorType<preAssignationType> = {
  generate: ({ _id, userId, number, source, creationDate } = {}) => ({
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    userId: userId ? idModule.lib.buildId(userId) : idModule.lib.buildId(),
    number: number ?? Math.floor(Math.random() * 1000000).toString(),
    source: source ?? `SOURCE_${Math.random()}`,
    creationDate: creationDate ?? new Date().getTime(),
  }),
};
