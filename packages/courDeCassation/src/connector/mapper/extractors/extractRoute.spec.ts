import { extractRoute } from './extractRoute';

describe('extractRoute', () => {
  it('should return exhaustive if jurica', () => {
    const route = extractRoute({
      solution: 'non-admission',
      publicationCategory: ['W'],
      chamberId: 'CR',
      civilCaseCode: '',
      civilMatterCode: '',
      criminalCaseCode: '',
      session: 'FHR',
      source: 'jurica',
    });

    expect(route).toBe('exhaustive');
  });
  it('should return automatic if NA', () => {
    const route = extractRoute({
      solution: 'non-admission',
      publicationCategory: ['W'],
      chamberId: 'CR',
      civilCaseCode: '',
      civilMatterCode: '',
      criminalCaseCode: '',
      source: 'jurinet',
      session: 'FHR',
    });

    expect(route).toBe('automatic');
  });

  it('should return confirmation if C', () => {
    const route = extractRoute({
      solution: 'Rejet non spécialement motivé',
      publicationCategory: ['W', 'C'],
      chamberId: 'CR',
      civilCaseCode: '',
      civilMatterCode: '',
      criminalCaseCode: '',
      session: 'FHR',
      source: 'jurinet',
    });

    expect(route).toBe('confirmation');
  });

  it('should return confirmation if AVIS', () => {
    const route = extractRoute({
      solution: 'Rejet non spécialement motivé',
      publicationCategory: ['W'],
      chamberId: 'AVIS',
      civilCaseCode: '',
      civilMatterCode: '',
      criminalCaseCode: '',
      session: 'FHR',
      source: 'jurinet',
    });

    expect(route).toBe('confirmation');
  });

  it('should return confirmation if Assemblée plénière', () => {
    const route = extractRoute({
      solution: 'Rejet non spécialement motivé',
      publicationCategory: ['W'],
      chamberId: 'SOC',
      civilCaseCode: '',
      civilMatterCode: '',
      criminalCaseCode: '',
      session: 'PL',
      source: 'jurinet',
    });

    expect(route).toBe('confirmation');
  });

  it('should return confirmation if chambre mixte', () => {
    const route = extractRoute({
      solution: 'Rejet non spécialement motivé',
      publicationCategory: ['W'],
      chamberId: 'SOC',
      civilCaseCode: '',
      civilMatterCode: '',
      criminalCaseCode: '',
      session: 'MI',
      source: 'jurinet',
    });

    expect(route).toBe('confirmation');
  });

  it('should return exhaustive if category published', () => {
    const route = extractRoute({
      solution: 'Rejet non spécialement motivé',
      publicationCategory: ['W', 'L'],
      chamberId: 'SOC',
      civilCaseCode: '',
      civilMatterCode: '',
      criminalCaseCode: '',
      session: 'FHR',
      source: 'jurinet',
    });

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if category published', () => {
    const route = extractRoute({
      solution: 'Rejet non spécialement motivé',
      publicationCategory: ['W', 'P'],
      chamberId: 'SOC',
      civilCaseCode: '',
      civilMatterCode: '',
      criminalCaseCode: '',
      session: 'FHR',
      source: 'jurinet',
    });

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if category published', () => {
    const route = extractRoute({
      solution: 'Rejet non spécialement motivé',
      publicationCategory: ['W', 'B'],
      chamberId: 'SOC',
      civilCaseCode: '',
      civilMatterCode: '',
      criminalCaseCode: '',
      session: 'FHR',
      source: 'jurinet',
    });

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if QPC', () => {
    const route = extractRoute({
      solution: 'Rejet non spécialement motivé',
      publicationCategory: ['W'],
      chamberId: 'SOC',
      civilCaseCode: '',
      civilMatterCode: '',
      criminalCaseCode: 'QPC',
      session: 'FHR',
      source: 'jurinet',
    });

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if QPC', () => {
    const route = extractRoute({
      solution: 'Rejet non spécialement motivé',
      publicationCategory: ['W'],
      chamberId: 'SOC',
      civilCaseCode: 'QPCR',
      civilMatterCode: '',
      criminalCaseCode: '',
      session: 'FHR',
      source: 'jurinet',
    });

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if QPC', () => {
    const route = extractRoute({
      solution: 'QPC incidente',
      publicationCategory: ['W'],
      chamberId: 'SOC',
      civilCaseCode: '',
      civilMatterCode: '',
      criminalCaseCode: 'AROD',
      session: 'FHR',
      source: 'jurinet',
    });

    expect(route).toBe('exhaustive');
  });

  it('should return automatic if Désistement', () => {
    const route = extractRoute({
      solution: 'Desistement par arret',
      publicationCategory: ['W'],
      chamberId: 'SOC',
      civilCaseCode: '',
      civilMatterCode: '',
      criminalCaseCode: '',
      session: 'FHR',
      source: 'jurinet',
    });

    expect(route).toBe('automatic');
  });

  it('should return automatic if Déchéance', () => {
    const route = extractRoute({
      solution: 'Decheance',
      publicationCategory: ['W'],
      chamberId: 'SOC',
      civilCaseCode: '',
      civilMatterCode: '',
      criminalCaseCode: '',
      session: 'FHR',
      source: 'jurinet',
    });

    expect(route).toBe('automatic');
  });

  it('should return simple if formation restreinte', () => {
    const route = extractRoute({
      solution: 'Cassation partielle',
      publicationCategory: ['W'],
      chamberId: 'SOC',
      civilCaseCode: '',
      civilMatterCode: '',
      criminalCaseCode: '',
      session: 'FRH',
      source: 'jurinet',
    });

    expect(route).toBe('simple');
  });

  it('should return simple if Rejet non spécialement motivé', () => {
    const route = extractRoute({
      solution: 'Rejet non spécialement motivé',
      publicationCategory: ['W'],
      chamberId: 'SOC',
      civilCaseCode: '',
      civilMatterCode: '',
      criminalCaseCode: '',
      session: '',
      source: 'jurinet',
    });

    expect(route).toBe('simple');
  });
});
