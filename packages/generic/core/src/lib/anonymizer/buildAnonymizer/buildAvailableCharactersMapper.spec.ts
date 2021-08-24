import { annotationModule } from '../../../modules/annotation';
import { buildAvailableCharactersMapper } from './buildAvailableCharactersMapper';

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
});
