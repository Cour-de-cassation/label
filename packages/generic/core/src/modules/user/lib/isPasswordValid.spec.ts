import { isPasswordValid } from './isPasswordValid';

describe('isPasswordValid', () => {
  it('should return true if the password is longer than 8 characters', () => {
    const password = '12345678';

    const result = isPasswordValid(password);

    expect(result).toEqual(true);
  });

  it('should return false if the password is lesser than 8 characters', () => {
    const password = '1234567';

    const result = isPasswordValid(password);

    expect(result).toEqual(false);
  });
});
