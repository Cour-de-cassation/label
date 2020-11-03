import { idModule, omitIdType } from '../../id';
import { assignationType } from '../assignationType';

export { buildAssignation };

const buildAssignation: (assignationFields: omitIdType<assignationType>) => assignationType =
  idModule.lib.buildObjectWithId;
