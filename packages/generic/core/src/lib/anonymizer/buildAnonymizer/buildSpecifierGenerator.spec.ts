import { buildAnnotation } from '../../../modules/annotation';
import { buildSpecifierGenerator } from './buildSpecifierGenerator';

describe('buildSpecifierGenerator', () => {
  it('should return correct generated specifier values', () => {
    const annotation1 = buildAnnotation({
      category: 'nom',
      start: 0,
      text: `gle`,
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
      category: 'adresse',
      start: 0,
      text: `13 rue`,
      score: 1,
      source: 'agent',
    });
    const annotation4 = buildAnnotation({
      category: 'adresse',
      start: 0,
      text: `45 cour`,
      score: 1,
      source: 'agent',
    });
    const specifierGenerator = buildSpecifierGenerator([annotation1, annotation2, annotation3, annotation4], 123);

    const generatedCharacter1 = specifierGenerator['%c'].generate(annotation1);
    const generatedCharacter2 = specifierGenerator['%c'].generate(annotation2);
    const generatedNumber1 = specifierGenerator['%d'].generate();
    const generatedNumber2 = specifierGenerator['%d'].generate();

    expect(generatedCharacter1.length).toBe(1);
    expect(generatedCharacter2.length).toBe(1);
    expect(generatedCharacter1).not.toBe(generatedCharacter2);
    expect(generatedNumber1).toBe('1');
    expect(generatedNumber2).toBe('2');
  });
});
