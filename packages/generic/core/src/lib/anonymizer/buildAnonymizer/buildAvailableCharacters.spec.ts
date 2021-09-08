import { flatten, uniq } from 'lodash';
import { buildAvailableCharacters } from './buildAvailableCharacters';

describe('buildAvailableCharacters', () => {
  it('should build a set of available characters distinct with one or two characters length', () => {
    const count = 100;
    const availableCharacters = flatten(buildAvailableCharacters(count));

    const distinctAvailableCharacters = uniq(availableCharacters);
    expect(availableCharacters).toEqual(distinctAvailableCharacters);
    expect(availableCharacters.every(isCharacterLengthLessThanTwo)).toBeTruthy();
  });
});

function isCharacterLengthLessThanTwo(character: string) {
  return character.length <= 2;
}
