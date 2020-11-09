import { idModule, omitIdType } from '../../id';
import { userType } from '../userType';

export { buildUser };

function buildUser(userFields: omitIdType<userType>): userType {
  return {
    ...userFields,
    _id: idModule.lib.buildId(),
  };
}
