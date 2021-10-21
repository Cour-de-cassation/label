import { extractRoute } from './extractRoute';

describe('extractRoute', () => {
  it('should return automatic if NA', () => {
    const route = extractRoute({
      solution: 'non-admission',
      publicationCategory: ['W'],
      chamberId: 'CR',
      civilCaseCode: '',
      civilMatterCode: '',
      criminalCaseCode: '',
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
    });

    expect(route).toBe('automatic');
  });
});
