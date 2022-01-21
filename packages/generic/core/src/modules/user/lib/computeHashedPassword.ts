import { hasher } from '../../../utils';

export { computeHashedPassword };

async function computeHashedPassword(password: string) {
  return hasher.hash(password);
}
