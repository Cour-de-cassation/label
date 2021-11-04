import { uniq } from 'lodash';
import { buildCharacterList, FORBIDDEN_CHARACTERS } from './buildCharacterList';
import { isCapitalLetterCharCode } from './isCapitalLetterCharCode';

describe('buildCharacterList', () => {
  it('should work for 2-sized list', () => {
    const length = 2;

    const characterList = buildCharacterList(length);

    expect(characterList.length).toBe(Math.pow(26 - FORBIDDEN_CHARACTERS.length, length));
    const uniqueCharacterList = uniq(characterList);
    expect(uniqueCharacterList).toEqual(characterList);
    expect(characterList.every(onlyContainsAZCharacters)).toBeTruthy();
  });
});

function onlyContainsAZCharacters(characters: string) {
  for (let i = 0; i < characters.length; i++) {
    const charCode = characters.charCodeAt(i);
    if (!isCapitalLetterCharCode(charCode)) {
      return false;
    }
  }
  return true;
}
