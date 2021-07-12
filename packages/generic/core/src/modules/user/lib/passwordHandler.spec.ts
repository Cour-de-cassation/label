import { dateBuilder } from '../../../utils';
import { userGenerator } from '../generator';
import { passwordHandler } from './passwordHandler';

describe('passwordHandler', () => {
  describe('generate', () => {
    it('should return true for a generated password', () => {
      const password = passwordHandler.generate();

      expect(passwordHandler.isValid(password)).toBeTruthy();
    });
  });

  describe('getPasswordTimeValidityStatus', () => {
    it('should return valid for a generated user', () => {
      const user = userGenerator.generate();

      expect(passwordHandler.getPasswordTimeValidityStatus(user)).toBe('valid');
    });

    it('should return outdated for an old user', () => {
      const user = userGenerator.generate({ passwordLastUpdateDate: dateBuilder.monthsAgo(7) });

      expect(passwordHandler.getPasswordTimeValidityStatus(user)).toBe('outdated');
    });
  });

  describe('isValid', () => {
    it('should return true if the password is longer than 8 characters', () => {
      const password = 'a3_bZP8&password';

      const result = passwordHandler.isValid(password);

      expect(result).toEqual(true);
    });

    it('should return false if the password is lesser than 8 characters', () => {
      const password = '1234567';

      const result = passwordHandler.isValid(password);

      expect(result).toEqual(false);
    });

    it('should return true if the password has at least 2 lower case, 2 upper case, 2 digits and 2 special characters', () => {
      const password = 'a3_bZP8&';

      const result = passwordHandler.isValid(password);

      expect(result).toEqual(true);
    });

    it('should return false if the password has less than 2 lower case', () => {
      const password = 'a3_BZP8&';

      const result = passwordHandler.isValid(password);

      expect(result).toEqual(false);
    });

    it('should return false if the password has less than 2 upper case', () => {
      const password = 'a3_bzP8&';

      const result = passwordHandler.isValid(password);

      expect(result).toEqual(false);
    });

    it('should return false if the password has less than 2 digits', () => {
      const password = 'a3_bZPS&';

      const result = passwordHandler.isValid(password);

      expect(result).toEqual(false);
    });

    it('should return false if the password has less than 2 special characters', () => {
      const password = 'a3_bZP88';

      const result = passwordHandler.isValid(password);

      expect(result).toEqual(false);
    });
  });
});
