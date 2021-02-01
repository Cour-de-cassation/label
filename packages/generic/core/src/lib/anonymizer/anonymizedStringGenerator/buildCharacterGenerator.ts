import { anonymizedGeneratorType } from './types';

export { buildCharacterGenerator };

const A_ASCII_CODE = 65;
const Z_ASCII_CODE = 90;

function buildCharacterGenerator(): anonymizedGeneratorType {
  let availableCharacterCode = initializeAvailableCharacterCode();

  return {
    generate() {
      const generatedCharacter = String.fromCharCode(getAvailableCharacterCode());

      return generatedCharacter;
    },
  };

  function getAvailableCharacterCode(): number {
    const availableCharacterCodeArray = Array.from(availableCharacterCode.values());

    if (availableCharacterCodeArray.length === 0) {
      availableCharacterCode = initializeAvailableCharacterCode();
      return getAvailableCharacterCode();
    }

    const characterCode = availableCharacterCodeArray[Math.floor(Math.random() * availableCharacterCodeArray.length)];

    availableCharacterCode.delete(characterCode);

    return characterCode;
  }
}

function initializeAvailableCharacterCode() {
  const availableCharacterCode = new Set() as Set<number>;

  for (let characterCode = A_ASCII_CODE; characterCode <= Z_ASCII_CODE; characterCode++) {
    availableCharacterCode.add(characterCode);
  }

  return availableCharacterCode;
}
