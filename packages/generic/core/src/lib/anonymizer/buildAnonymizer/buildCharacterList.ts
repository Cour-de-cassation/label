import { range } from 'lodash';

export { buildCharacterList, FORBIDDEN_CHARACTERS };

const FORBIDDEN_CHARACTERS = ['Q'];

function buildCharacterList(length: number) {
  const A_ASCII_CODE = 65;
  const characterListLength = Math.pow(26, length);

  const characterLists: string[][] = [];

  for (let i = 0; i < length; i++) {
    const currentCharacterList = range(characterListLength).map((_, index) => {
      return String.fromCharCode(((index / Math.pow(26, length - 1 - i)) % 26) + A_ASCII_CODE);
    });
    characterLists.push(currentCharacterList);
  }

  const characterList = range(characterListLength).map((_, index) => {
    const currentStringArray: string[] = [];
    for (let i = 0; i < length; i++) {
      currentStringArray.push(characterLists[i][index]);
    }
    return currentStringArray.join('');
  });
  return characterList.filter((characters) =>
    FORBIDDEN_CHARACTERS.every((forbiddenCharacter) => !characters.includes(forbiddenCharacter)),
  );
}
