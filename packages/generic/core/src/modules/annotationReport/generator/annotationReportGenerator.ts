import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { annotationReportType } from '../annotationReportType';

export { annotationReportGenerator };

const annotationReportGenerator: generatorType<annotationReportType> = {
  generate: ({ checkList, documentId, _id } = {}) => ({
    checkList: checkList ? checkList : [],
    documentId: documentId ? idModule.lib.buildId(documentId) : idModule.lib.buildId(),
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
  }),
};
