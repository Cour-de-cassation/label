import { idModule } from '../../id';
import { userType } from '../userType';
import { authenticator } from './authenticator';

export { buildUser };

async function buildUser({
  email,
  name,
  password,
  role,
}: {
  email: string;
  name: string;
  password: string;
  role: userType['role'];
}): Promise<userType> {
  const baseUser = await authenticator.buildBaseUser({ email, name, password });
  return {
    ...baseUser,
    _id: idModule.lib.buildId(),
    role,
  };
}
