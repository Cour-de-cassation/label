import { buildCharacterGenerator } from './buildCharacterGenerator';

describe('buildCharacterGenerator', () => {
  describe('generate', () => {
    it('should return different strings when called 26 times', () => {
      const characterGenerator = buildCharacterGenerator();
      const characterList = [];

      for (let i = 0; i < 26; i++) {
        characterList.push(characterGenerator.generate());
      }

      expect(characterList.sort().join('')).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    });

    it('should return iterate over double characters when called 28 times', () => {
      const characterGenerator = buildCharacterGenerator();
      for (let i = 0; i < 26; i++) {
        characterGenerator.generate();
      }

      const firstCharacters = characterGenerator.generate();
      const secondCharacters = characterGenerator.generate();

      expect(firstCharacters.length).toBe(2);
      expect(secondCharacters.length).toBe(2);
      expect(firstCharacters[0]).toBe(firstCharacters[1]);
      expect(secondCharacters[0]).toBe(secondCharacters[1]);
      expect(firstCharacters).not.toEqual(secondCharacters);
    });
  });
});
