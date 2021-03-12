import { range } from 'lodash';

export { generatePassword };

const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const PASSWORD_LENGTH = 8;

function generatePassword() {
  return range(PASSWORD_LENGTH)
    .map(() => {
      const characterIndex = Math.floor(Math.random() * CHARACTERS.length);
      return CHARACTERS[characterIndex];
    })
    .join('');
}
