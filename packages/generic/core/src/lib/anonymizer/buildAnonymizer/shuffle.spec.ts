import { shuffle } from './shuffle';

describe('schuffle', () => {
  const array = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  it('should return a shuffled array', () => {
    const seed = 54;

    const shuffledArray = shuffle(array, seed);

    expect(shuffledArray).not.toEqual(array);
    expect(shuffledArray.sort()).toEqual(array);
  });

  it('should return an identical array for same seed', () => {
    const seed = 12345;

    const shuffledArray1 = shuffle(array, seed);
    const shuffledArray2 = shuffle(array, seed);

    expect(shuffledArray1).toEqual(shuffledArray2);
  });
});
