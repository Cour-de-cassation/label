import { range } from 'lodash';
import { hasher } from '../../../utils';
import { passwordTimeValidityStatusType, userType } from '../userType';

export { passwordHandler };

export type { passwordTimeValidityStatusType };

const MIN_LOWER_CASE_CHARACTERS_COUNT = 2;

const MIN_UPPER_CASE_CHARACTERS_COUNT = 2;

const MIN_DIGITS_COUNT = 2;

const MIN_SPECIAL_CHARACTERS_COUNT = 2;

const MIN_PASSWORD_LENGTH = 8;

const LOWER_CASE_CHARACTERS = 'abcdefghijklmnopqrstuvwxyz';

const UPPER_CASE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const DIGITS = '0123456789';

const SPECIAL_CHARACTERS = '&@_-"\'#~{([|`\\^)]=+}^¨$%*!:/;.,?<>';

const ONE_MONTH = 30 * 24 * 3600 * 1000;
const MAX_PASSWORD_TIME_VALIDITY = 6 * ONE_MONTH;

const passwordHandler = {
  checkUser(user: userType, password: string) {
    return hasher.compare(password, user.hashedPassword);
  },

  getPasswordTimeValidityStatus(user: userType): passwordTimeValidityStatusType {
    const passwordStatus = Date.now() - user.passwordLastUpdateDate < MAX_PASSWORD_TIME_VALIDITY ? 'valid' : 'outdated';
    return passwordStatus;
  },

  generate() {
    const generatedLowerCaseCharacters = generateFromPossibleCharacters(
      LOWER_CASE_CHARACTERS,
      MIN_LOWER_CASE_CHARACTERS_COUNT,
    );

    const generatedUpperCaseCharacters = generateFromPossibleCharacters(
      UPPER_CASE_CHARACTERS,
      MIN_UPPER_CASE_CHARACTERS_COUNT,
    );

    const generatedDigits = generateFromPossibleCharacters(DIGITS, MIN_DIGITS_COUNT);

    const generatedSpecialCharacters = generateFromPossibleCharacters(SPECIAL_CHARACTERS, MIN_SPECIAL_CHARACTERS_COUNT);

    const generatedPassword = [
      generatedLowerCaseCharacters,
      generatedUpperCaseCharacters,
      generatedDigits,
      generatedSpecialCharacters,
    ].join('');

    return shuffleString(generatedPassword);

    function generateFromPossibleCharacters(possibleCharacters: string, length: number) {
      return range(length)
        .map(() => {
          const characterIndex = Math.floor(Math.random() * possibleCharacters.length);
          return possibleCharacters[characterIndex];
        })
        .join('');
    }

    function shuffleString(str: string) {
      return str
        .split('')
        .sort(function () {
          return 0.5 - Math.random();
        })
        .join('');
    }
  },

  isValid(password: string) {
    const lowerCaseCharactersCount = countCharacters(LOWER_CASE_CHARACTERS);
    const upperCaseCharactersCount = countCharacters(UPPER_CASE_CHARACTERS);
    const digitsCount = countCharacters(DIGITS);
    const specialCharactersCount = countCharacters(SPECIAL_CHARACTERS);

    return (
      lowerCaseCharactersCount >= MIN_LOWER_CASE_CHARACTERS_COUNT &&
      upperCaseCharactersCount >= MIN_UPPER_CASE_CHARACTERS_COUNT &&
      digitsCount >= MIN_DIGITS_COUNT &&
      specialCharactersCount >= MIN_SPECIAL_CHARACTERS_COUNT &&
      password.length >= MIN_PASSWORD_LENGTH
    );

    function countCharacters(possibleCharacters: string) {
      let charactersCount = 0;

      for (const char of password) {
        if (possibleCharacters.includes(char)) {
          charactersCount++;
        }
      }

      return charactersCount;
    }
  },
};
