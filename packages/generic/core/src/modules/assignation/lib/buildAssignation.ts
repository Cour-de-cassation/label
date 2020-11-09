import { idModule, omitIdType } from '../../id';
import { assignationType } from '../assignationType';

export { buildAssignation };

function buildAssignation(assignationFields: omitIdType<assignationType>): assignationType {
  return {
    ...assignationFields,
    _id: idModule.lib.buildId(),
  };
}
