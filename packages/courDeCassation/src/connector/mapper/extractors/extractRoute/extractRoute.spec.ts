import { extractRoute } from '.';

describe('extractRoute', () => {
  it('should return exhaustive because it is juritj', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: '',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre criminelle',
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

  it('should return default if no endCaseCode & no NACCode', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'non-admission',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre criminelle',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurica',
    );

    expect(route).toBe('default');
  });

  it('should return exhaustive if jurica with endCaseCode 44E & NACCode 10A', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'non-admission',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre criminelle',
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
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre criminelle',
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
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre criminelle',
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

  it('should return default if jurica with endCaseCode 33G (not in csv)', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'non-admission',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre criminelle',
        civilCaseCode: '',
        civilMatterCode: '',
        criminalCaseCode: '',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '33G',
      },
      'jurica',
    );

    expect(route).toBe('default');
  });

  it('should return automatic if NA', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'non-admission',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre criminelle',
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
        parties: [],
        publicationCategory: ['W', 'C'],
        chamberName: 'Chambre criminelle',
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
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Saisine pour avis',
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
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
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
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
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
        parties: [],
        publicationCategory: ['W', 'L'],
        chamberName: 'Chambre sociale',
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
        parties: [],
        publicationCategory: ['W', 'P'],
        chamberName: 'Chambre sociale',
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
        parties: [],
        publicationCategory: ['W', 'B'],
        chamberName: 'Chambre sociale',
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
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
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
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
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
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
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
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
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
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
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
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
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
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
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
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
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

  it('should return exhaustive if has more than 50 parties', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        parties: [
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
        ],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
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

  it('should return exhaustive if has more than 50 parties', async () => {
    const route = extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        parties: [
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
          'Partie',
        ],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
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
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
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
