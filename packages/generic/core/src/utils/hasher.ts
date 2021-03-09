import { hash as bcryptHash, compare as bcryptCompare } from 'bcryptjs';

export { hasher };

const SALT_ROUNDS = 10;

const hasher = {
  hash,
  compare,
};

async function hash(textToHash: string): Promise<string> {
  return bcryptHash(textToHash, SALT_ROUNDS);
}

async function compare(textToCompare: string, encryptedText: string): Promise<boolean> {
  return bcryptCompare(textToCompare, encryptedText);
}
