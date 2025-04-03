import { buildAnnotation } from '../../../modules/annotation';
import { buildEntityIdOrderMapper } from './buildEntityIdOrderMapper';

describe('buildEntityIdOrderMapper', () => {
  it('should return the order of every entityId inside the category', () => {
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
      text: `romain`,
      score: 1,
      source: 'agent',
    });
    const annotation3 = buildAnnotation({
      category: 'prenom',
      start: 0,
      text: `nicolas`,
      score: 1,
      source: 'agent',
    });
    const annotation4 = buildAnnotation({
      category: 'nom',
      start: 0,
      text: `gle`,
      score: 1,
      source: 'agent',
    });
    const annotation5 = buildAnnotation({
      category: 'nom',
      start: 0,
      text: `assouad`,
      score: 1,
      source: 'agent',
    });
    const annotation6 = buildAnnotation({
      category: 'nom',
      start: 0,
      text: `serrano`,
      score: 1,
      source: 'agent',
    });

    const entityIdOrderMapper = buildEntityIdOrderMapper([
      annotation1,
      annotation2,
      annotation3,
      annotation4,
      annotation5,
      annotation6,
    ]);

    expect(entityIdOrderMapper[annotation1.entityId]).toBe(0);
    expect(entityIdOrderMapper[annotation2.entityId]).toBe(2);
    expect(entityIdOrderMapper[annotation3.entityId]).toBe(1);
    expect(entityIdOrderMapper[annotation4.entityId]).toBe(1);
    expect(entityIdOrderMapper[annotation5.entityId]).toBe(0);
    expect(entityIdOrderMapper[annotation6.entityId]).toBe(2);
  });
});
