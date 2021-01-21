import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { userType } from '../userType';

export { userGenerator };

const userGenerator: generatorType<userType> = {
  generate: ({ email, _id, name, password, role } = {}) => ({
    email: email ? email : 'EMAIL',
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    name: name ? name : 'NAME',
    password: password ? password : 'PASSWORD',
    role: role ? role : 'annotator',
  }),
};
