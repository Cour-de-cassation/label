import { shuffleCharacterLists } from './shuffleCharacterLists';

describe('shuffleCharacterLists', () => {
  const seed = 123;
  it('should shuffle the character lists', () => {
    const characterLists = [
      ['A', 'B'],
      ['C', 'D'],
    ];

    const shuffledCharacterList = shuffleCharacterLists(characterLists, seed);

    expect([...shuffledCharacterList].sort()).toEqual(['A', 'B', 'C', 'D']);
  });

  it('should preserve the orders of the initial lists', () => {
    const characterLists = [
      ['A', 'B', 'C'],
      ['D', 'E', 'F', 'G'],
    ];

    const shuffledCharacterList = shuffleCharacterLists(characterLists, seed);

    expect([...shuffledCharacterList.slice(0, 3)].sort()).toEqual(['A', 'B', 'C']);
    expect([...shuffledCharacterList.slice(3)].sort()).toEqual(['D', 'E', 'F', 'G']);
  });
});
