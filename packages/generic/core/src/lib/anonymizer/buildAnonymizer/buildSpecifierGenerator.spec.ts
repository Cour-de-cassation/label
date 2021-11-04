import { buildSpecifierGenerator } from './buildSpecifierGenerator';

describe('buildSpecifierGenerator', () => {
  it('should return correct generated specifier values', () => {
    const entityIds = ['nom_gle', 'prenom_romain', 'adresse_13 rue', 'adresse_45 cour'];
    const specifierGenerator = buildSpecifierGenerator(entityIds, 123);

    const generatedCharacter1 = specifierGenerator['%c'].generate(entityIds[0]);
    const generatedCharacter2 = specifierGenerator['%c'].generate(entityIds[1]);
    const generatedNumber1 = specifierGenerator['%d'].generate();
    const generatedNumber2 = specifierGenerator['%d'].generate();

    expect(generatedCharacter1.length).toBe(1);
    expect(generatedCharacter2.length).toBe(1);
    expect(generatedCharacter1).not.toBe(generatedCharacter2);
    expect(generatedNumber1).toBe('1');
    expect(generatedNumber2).toBe('2');
  });
});
