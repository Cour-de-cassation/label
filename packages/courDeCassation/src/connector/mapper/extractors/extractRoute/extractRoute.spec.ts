import { extractRoute } from '.';

describe('extractRoute', () => {
  it('should return exhaustive because it is juritj', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: '',
        publicationCategory: ['W'],
        chamberId: 'CR',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: '',
        NACCode: '',
        endCaseCode: '',
      },
      'juritj',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if no endCaseCode & no NACCode', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'non-admission',
        publicationCategory: ['W'],
        chamberId: 'CR',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurica',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if jurica with endCaseCode 44E & NACCode 10A', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'non-admission',
        publicationCategory: ['W'],
        chamberId: 'CR',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'FHR',
        NACCode: '10A',
        endCaseCode: '44E',
      },
      'jurica',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return automatic if jurica with endCaseCode 11A', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'non-admission',
        publicationCategory: ['W'],
        chamberId: 'CR',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '11B',
      },
      'jurica',
    );

    expect(route).toBe('automatic');
  });

  it('should return simple if jurica with NACCode 55L', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'non-admission',
        publicationCategory: ['W'],
        chamberId: 'CR',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'FHR',
        NACCode: '55Z',
        endCaseCode: '',
      },
      'jurica',
    );

    expect(route).toBe('simple');
  });

  it('should return exhaustive if jurica with endCaseCode 33G (not in csv)', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'non-admission',
        publicationCategory: ['W'],
        chamberId: 'CR',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '33G',
      },
      'jurica',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return automatic if NA', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'non-admission',
        publicationCategory: ['W'],
        chamberId: 'CR',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('automatic');
  });

  it('should return confirmation if C', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        publicationCategory: ['W', 'C'],
        chamberId: 'CR',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('confirmation');
  });

  it('should return confirmation if AVIS', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        publicationCategory: ['W'],
        chamberId: 'AVIS',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('confirmation');
  });

  it('should return confirmation if Assemblée plénière', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        publicationCategory: ['W'],
        chamberId: 'SOC',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'PL',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('confirmation');
  });

  it('should return confirmation if chambre mixte', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        publicationCategory: ['W'],
        chamberId: 'SOC',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'MI',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('confirmation');
  });

  it('should return exhaustive if category published', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        publicationCategory: ['W', 'L'],
        chamberId: 'SOC',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if category published', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        publicationCategory: ['W', 'P'],
        chamberId: 'SOC',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if category published', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        publicationCategory: ['W', 'B'],
        chamberId: 'SOC',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if QPC', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        publicationCategory: ['W'],
        chamberId: 'SOC',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: 'QPC',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if QPC', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        publicationCategory: ['W'],
        chamberId: 'SOC',
        civilCaseCode: 'QPCR',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if QPC', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'QPC incidente',
        publicationCategory: ['W'],
        chamberId: 'SOC',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: 'AROD',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return automatic if Désistement', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Desistement par arret',
        publicationCategory: ['W'],
        chamberId: 'SOC',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('automatic');
  });

  it('should return automatic if Déchéance', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Decheance',
        publicationCategory: ['W'],
        chamberId: 'SOC',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('automatic');
  });

  it('should return simple if formation restreinte', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Cassation partielle',
        publicationCategory: ['W'],
        chamberId: 'SOC',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'FRH',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('simple');
  });

  it('should return simple if Rejet non spécialement motivé', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        publicationCategory: ['W'],
        chamberId: 'SOC',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: '',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('simple');
  });

  it('should return exhaustive if has additionalTermsToAnnotate', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: 'Something',
        solution: 'Rejet non spécialement motivé',
        publicationCategory: ['W'],
        chamberId: 'SOC',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: '',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive even if Rejet non spécialement motivé because has additionalTermsToAnnotate', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: 'Something',
        solution: 'Rejet non spécialement motivé',
        publicationCategory: ['W'],
        chamberId: 'SOC',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: '',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });
});
