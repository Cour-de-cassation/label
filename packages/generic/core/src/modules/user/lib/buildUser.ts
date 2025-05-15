import { idModule } from '../../id';
import { userType } from '../userType';

export { buildUser };

async function buildUser({
  email,
  name,
  role,
}: {
  email: string;
  name: string;
  role: userType['role'];
}): Promise<userType> {
  return {
    _id: idModule.lib.buildId(),
    email: email.trim().toLowerCase(),
    name,
    role,
  };
}
