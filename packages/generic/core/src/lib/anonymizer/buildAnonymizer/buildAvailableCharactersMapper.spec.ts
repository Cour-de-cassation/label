import { range } from 'lodash';
import { buildAvailableCharactersMapper } from './buildAvailableCharactersMapper';
import { FORBIDDEN_CHARACTERS } from './buildCharacterList';
import { buildAnnotation } from '../../../modules/annotation/lib';

describe('buildAvailableCharactersMapper', () => {
  const seed = 123;
  it('should build a mapper with 2 categories', () => {
    const annotation1 = buildAnnotation({
      category: 'prenom',
      start: 0,
      text: `benoit`,
      score: 1,
      source: 'agent',
    });
    const annotation2 = buildAnnotation({
      category: 'prenom',
      start: 0,
      text: `nicolas`,
      score: 1,
      source: 'agent',
    });
    const annotation3 = buildAnnotation({
      category: 'nom',
      start: 0,
      text: `gle`,
      score: 1,
      source: 'agent',
    });

    const mapper = buildAvailableCharactersMapper([annotation1, annotation2, annotation3], seed);

    expect(mapper['prenom']).toBeTruthy();
    expect(mapper['nom']).toBeTruthy();
    expect([...mapper['nom']].sort()).toEqual([...mapper['prenom']].sort());
    expect(mapper['nom']).not.toEqual(mapper['prenom']);
  });

  it('should build a mapper that prioritize the one-letter replacements', () => {
    const annotations = range(26 - FORBIDDEN_CHARACTERS.length + 1).map((value) =>
      buildAnnotation({
        category: 'prenom',
        start: 0,
        text: `${value}`,
        score: 1,
        source: 'agent',
      }),
    );

    const mapper = buildAvailableCharactersMapper(annotations, seed);

    expect([...mapper['prenom'].slice(0, 26 - FORBIDDEN_CHARACTERS.length)].sort()).toEqual([
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
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ]);
  });
});
