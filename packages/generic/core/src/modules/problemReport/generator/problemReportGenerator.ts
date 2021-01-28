import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { problemReportType } from '../problemReportType';

export { problemReportGenerator };

const problemReportGenerator: generatorType<problemReportType> = {
  generate: ({ assignationId, _id, date, text, type } = {}) => {
    return {
      assignationId: assignationId ? idModule.lib.buildId(assignationId) : idModule.lib.buildId(),
      date: date ? date : new Date().getTime(),
      _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
      text: text ? text : `TEXT_${Math.random()}`,
      type: type ? type : 'bug',
    };
  },
};
