import bcrypt from 'bcrypt'

export { hasher };

const SALT_ROUNDS = 10;

const hasher = {
  hash,
  compare
}

function hash(textToHash: string) {
  return bcrypt.hash(textToHash, SALT_ROUNDS)
}

function compare(textToCompare: string, encryptedText: string) {
  return bcrypt.compare(textToCompare, encryptedText);
}
