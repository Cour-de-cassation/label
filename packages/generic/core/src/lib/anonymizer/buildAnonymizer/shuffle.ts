import { range } from 'lodash';

export { shuffle };

const salt = 4.5;

function shuffle<T>(array: T[], seed: number): T[] {
  const indexes = range(array.length).map((_, index) => index);
  return indexes
    .sort((indexA, indexB) => Math.sin(indexA * seed * salt) - Math.sin(indexB * seed * salt))
    .map((index) => array[index]);
}
