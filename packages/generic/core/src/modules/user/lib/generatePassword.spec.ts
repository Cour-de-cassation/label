import { generatePassword } from './generatePassword';
import { isPasswordValid } from './isPasswordValid';

describe('generatePassword', () => {
  it('should return true for a generated password', () => {
    const password = generatePassword();

    expect(isPasswordValid(password)).toBeTruthy();
  });
});
