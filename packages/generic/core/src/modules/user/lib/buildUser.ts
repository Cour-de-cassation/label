import { idModule } from '../../id';
import { userType } from '../userType';
import { computeHashedPassword } from './computeHashedPassword';
import { formatEmail } from './formatEmail';

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
  const hashedPassword = await computeHashedPassword(password);

  return {
    email: formatEmail(email),
    hashedPassword,
    _id: idModule.lib.buildId(),
    name,
    role,
  };
}
