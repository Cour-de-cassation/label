import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { monitoringEntryType } from '../monitoringEntryType';

export { monitoringEntryGenerator };

const monitoringEntryGenerator: generatorType<monitoringEntryType> = {
  generate: ({ description, documentId, _id, type, userId } = {}) => {
    return {
      description: description ? description : 'DESCRIPTION',
      documentId: documentId ? idModule.lib.buildId(documentId) : idModule.lib.buildId(),
      _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
      type: type ? type : 'TYPE',
      userId: userId ? idModule.lib.buildId(userId) : idModule.lib.buildId(),
    };
  },
};
