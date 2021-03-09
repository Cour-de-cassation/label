import { hasher } from '../../../utils';
import { userType } from '../userType';

export { isUserPassword };

async function isUserPassword(user: userType, password: string) {
  return hasher.compare(password, user.hashedPassword);
}
