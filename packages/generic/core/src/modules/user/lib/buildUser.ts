import { idModule, omitIdType } from '../../id';
import { userType } from '../userType';

export { buildUser };

const buildUser: (userFields: omitIdType<userType>) => userType = idModule.lib.buildObjectWithId;
