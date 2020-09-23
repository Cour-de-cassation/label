import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';

export { hasher };

const SALT_ROUNDS = 10;

const hasher = {
  hash,
  compare,
};

function hash(textToHash: string): Promise<string> {
  return bcryptHash(textToHash, SALT_ROUNDS);
}

function compare(
  textToCompare: string,
  encryptedText: string,
): Promise<boolean> {
  return bcryptCompare(textToCompare, encryptedText);
}
