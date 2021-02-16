import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { monitoringEntryType } from '../monitoringEntryType';

export { monitoringEntryGenerator };

const monitoringEntryGenerator: generatorType<monitoringEntryType> = {
  generate: ({ _id, action, creationDate, documentId, origin, userId } = {}) => {
    return {
      _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
      action: action ? action : '',
      creationDate: creationDate ? creationDate : new Date().getTime(),
      documentId: documentId ? idModule.lib.buildId(documentId) : idModule.lib.buildId(),
      origin: origin ? origin : 'document',
      userId: userId ? idModule.lib.buildId(userId) : idModule.lib.buildId(),
    };
  },
};
