import { range } from 'lodash';
import { annotationModule } from '../../../modules/annotation';
import { buildAvailableCharactersMapper } from './buildAvailableCharactersMapper';
import { FORBIDDEN_CHARACTERS } from './buildCharacterList';

describe('buildAvailableCharactersMapper', () => {
  const seed = 123;
  it('should build a mapper with 2 categories', () => {
    const entityId1 = annotationModule.lib.entityIdHandler.compute('prenom', 'benoit');
    const entityId2 = annotationModule.lib.entityIdHandler.compute('prenom', 'nicolas');
    const entityId3 = annotationModule.lib.entityIdHandler.compute('nom', 'gle');

    const mapper = buildAvailableCharactersMapper([entityId1, entityId2, entityId3], seed);

    expect(mapper['prenom']).toBeTruthy();
    expect(mapper['nom']).toBeTruthy();
    expect([...mapper['nom']].sort()).toEqual([...mapper['prenom']].sort());
    expect(mapper['nom']).not.toEqual(mapper['prenom']);
  });

  it('should build a mapper that prioritize the one-letter replacements', () => {
    const entityIds = range(26 - FORBIDDEN_CHARACTERS.length + 1).map((value) =>
      annotationModule.lib.entityIdHandler.compute('prenom', `${value}`),
    );

    const mapper = buildAvailableCharactersMapper(entityIds, seed);

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
