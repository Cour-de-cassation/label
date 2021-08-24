import { annotationModule } from '../../../modules/annotation';
import { buildEntityIdOrderMapper } from './buildEntityIdOrderMapper';

describe('buildEntityIdOrderMapper', () => {
  it('should return the order of every entityId inside the category', () => {
    const entityId1 = annotationModule.lib.entityIdHandler.compute('prenom', 'benoit');
    const entityId2 = annotationModule.lib.entityIdHandler.compute('prenom', 'romain');
    const entityId3 = annotationModule.lib.entityIdHandler.compute('prenom', 'nicolas');
    const entityId4 = annotationModule.lib.entityIdHandler.compute('nom', 'gle');
    const entityId5 = annotationModule.lib.entityIdHandler.compute('nom', 'assouad');
    const entityId6 = annotationModule.lib.entityIdHandler.compute('nom', 'serrano');

    const entityIdOrderMapper = buildEntityIdOrderMapper([
      entityId1,
      entityId2,
      entityId3,
      entityId4,
      entityId5,
      entityId6,
    ]);

    expect(entityIdOrderMapper[entityId1]).toBe(0);
    expect(entityIdOrderMapper[entityId2]).toBe(2);
    expect(entityIdOrderMapper[entityId3]).toBe(1);
    expect(entityIdOrderMapper[entityId4]).toBe(1);
    expect(entityIdOrderMapper[entityId5]).toBe(0);
    expect(entityIdOrderMapper[entityId6]).toBe(2);
  });
});
