import { extractRoute } from '.';

describe('extractRoute', () => {
  it('should return default because it is juritj', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: '',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre criminelle',
        session: '',
        NACCode: '',
        endCaseCode: '',
      },
      'juritj',
    );

    expect(route).toBe('default');
  });

  it('should return default if no endCaseCode & no NACCode', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'non-admission',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre criminelle',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurica',
    );

    expect(route).toBe('default');
  });

  it('should return exhaustive if jurica with endCaseCode 44E & NACCode 10A', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'non-admission',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre criminelle',

        session: 'FHR',
        NACCode: '10A',
        endCaseCode: '44E',
      },
      'jurica',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return automatic if jurica with endCaseCode 11A', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'non-admission',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre criminelle',

        session: 'FHR',
        NACCode: '',
        endCaseCode: '11B',
      },
      'jurica',
    );

    expect(route).toBe('automatic');
  });

  it('should return simple if jurica with NACCode 55L', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'non-admission',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre criminelle',

        session: 'FHR',
        NACCode: '55Z',
        endCaseCode: '',
      },
      'jurica',
    );

    expect(route).toBe('simple');
  });

  it('should return default if jurica with endCaseCode 33G (not in csv)', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'non-admission',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre criminelle',

        session: 'FHR',
        NACCode: '',
        endCaseCode: '33G',
      },
      'jurica',
    );

    expect(route).toBe('default');
  });

  it('should return automatic if NA', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'non-admission',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre criminelle',

        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('automatic');
  });

  it('should return confirmation if C', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        parties: [],
        publicationCategory: ['W', 'C'],
        chamberName: 'Chambre criminelle',

        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('confirmation');
  });

  it('should return confirmation if AVIS', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Saisine pour avis',

        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('confirmation');
  });

  it('should return confirmation if Assemblée plénière', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',

        session: 'PL',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('confirmation');
  });

  it('should return confirmation if chambre mixte', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',

        session: 'MI',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('confirmation');
  });

  it('should return exhaustive if category published', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        parties: [],
        publicationCategory: ['W', 'L'],
        chamberName: 'Chambre sociale',

        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if category published', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        parties: [],
        publicationCategory: ['W', 'P'],
        chamberName: 'Chambre sociale',

        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if category published', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        parties: [],
        publicationCategory: ['W', 'B'],
        chamberName: 'Chambre sociale',

        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if QPC', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',

        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if QPC', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',

        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if QPC', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'QPC incidente',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',

        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return automatic if Désistement', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Desistement par arret',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',

        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('automatic');
  });

  it('should return automatic if Déchéance', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Decheance',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
        session: 'FHR',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('automatic');
  });

  it('should return simple if formation restreinte', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Cassation partielle',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
        session: 'FRH',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('simple');
  });

  it('should return simple if Rejet non spécialement motivé', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: '',
        solution: 'Rejet non spécialement motivé',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
        session: '',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('simple');
  });

  it('should return exhaustive if has additionalTermsToAnnotate', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: 'Something',
        solution: 'Rejet non spécialement motivé',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
        session: '',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if has more than 50 parties', async () => {
    const route = await extractRoute(
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
        session: '',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if has more than 50 parties', async () => {
    const route = await extractRoute(
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
        session: '',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive even if Rejet non spécialement motivé because has additionalTermsToAnnotate', async () => {
    const route = await extractRoute(
      {
        additionalTermsToAnnotate: 'Something',
        solution: 'Rejet non spécialement motivé',
        parties: [],
        publicationCategory: ['W'],
        chamberName: 'Chambre sociale',
        session: '',
        NACCode: '',
        endCaseCode: '',
      },
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });
});
