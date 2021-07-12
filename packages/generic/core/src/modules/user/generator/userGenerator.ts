import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { userType } from '../userType';

export { userGenerator };

const userGenerator: generatorType<userType> = {
  generate: ({ deletionDate, email, hashedPassword, _id, isActivated, name, passwordLastUpdateDate, role } = {}) => ({
    email: email ? email : 'EMAIL',
    deletionDate: deletionDate || undefined,
    hashedPassword: hashedPassword ? hashedPassword : 'HASHED_PASSWORD',
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    isActivated: isActivated !== undefined ? isActivated : true,
    name: name ? name : 'NAME',
    passwordLastUpdateDate: passwordLastUpdateDate ? passwordLastUpdateDate : new Date().getTime(),
    role: role ? role : 'annotator',
  }),
};
