import { buildCharacterList, FORBIDDEN_CHARACTERS } from './buildCharacterList';

export { buildAvailableCharacters };

function buildAvailableCharacters(count: number) {
  let power = 0;
  let availableCharacters: string[][] = [];
  do {
    power++;
    const characterList = buildCharacterList(power);
    availableCharacters = [...availableCharacters, characterList];
  } while (Math.pow(26 - FORBIDDEN_CHARACTERS.length, power) < count);

  return availableCharacters;
}
