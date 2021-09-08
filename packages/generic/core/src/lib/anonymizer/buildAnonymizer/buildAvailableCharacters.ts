import { buildCharacterList } from './buildCharacterList';

export { buildAvailableCharacters };

function buildAvailableCharacters(count: number) {
  let power = 0;
  let availableCharacters: string[][] = [];
  do {
    power++;
    const characterList = buildCharacterList(power);
    availableCharacters = [...availableCharacters, characterList];
  } while (Math.pow(26, power) < count);

  return availableCharacters;
}
