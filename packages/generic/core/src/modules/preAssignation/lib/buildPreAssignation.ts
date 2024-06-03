import { idModule, omitIdType } from '../../id';
import { preAssignationType } from '../preAssignationType';

export { buildPreAssignation };

function buildPreAssignation(preAssignationFields: omitIdType<preAssignationType>): preAssignationType {
  return {
    ...preAssignationFields,
    _id: idModule.lib.buildId(),
  };
}
