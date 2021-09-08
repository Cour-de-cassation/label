import { shuffle } from '../../../utils';

export { shuffleCharacterLists };

function shuffleCharacterLists(characterLists: string[][], seed: number) {
  let shuffledCharacterList: string[] = [];
  characterLists.forEach((characterList) => {
    shuffledCharacterList = [...shuffledCharacterList, ...shuffle(characterList, seed)];
  });
  return shuffledCharacterList;
}
