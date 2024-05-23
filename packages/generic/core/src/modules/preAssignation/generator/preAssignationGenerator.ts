import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { preAssignationType } from '../preAssignationType';

export { preAssignationGenerator };

const preAssignationGenerator: generatorType<preAssignationType> = {
  generate: ({ _id, userId, documentNumber, source, creationDate } = {}) => ({
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    userId: userId ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    documentNumber: documentNumber ?? Math.floor(Math.random() * 1000000),
    source: source ?? `SOURCE_${Math.random()}`,
    creationDate: creationDate ?? new Date().getTime(),
  }),
};
