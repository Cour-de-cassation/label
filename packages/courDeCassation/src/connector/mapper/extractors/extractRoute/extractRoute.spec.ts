import { buildTreatmentRepository } from '@label/backend/dist/modules/treatment';
import { documentModule, idModule, treatmentModule } from '@label/core';
import { extractRoute } from '.';

describe('await extractRoute', () => {
  it('should return exhaustive if no endCaseCode & no NACCode', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurica',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if jurica with endCaseCode 44E & NACCode 10A', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurica',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return automatique if jurica with endCaseCode 11A', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurica',
    );

    expect(route).toBe('automatique');
  });

  it('should return simple if jurica with NACCode 55L', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurica',
    );

    expect(route).toBe('simple');
  });

  it('should return exhaustive if jurica with endCaseCode 33G (not in csv)', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurica',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return automatic if NA', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurinet',
    );

    expect(route).toBe('automatic');
  });

  it('should return confirmation if C', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurinet',
    );

    expect(route).toBe('confirmation');
  });

  it('should return confirmation if AVIS', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurinet',
    );

    expect(route).toBe('confirmation');
  });

  it('should return confirmation if Assemblée plénière', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurinet',
    );

    expect(route).toBe('confirmation');
  });

  it('should return confirmation if chambre mixte', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurinet',
    );

    expect(route).toBe('confirmation');
  });

  it('should return exhaustive if category published', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if category published', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if category published', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if QPC', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if QPC', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive if QPC', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return automatic if Désistement', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurinet',
    );

    expect(route).toBe('automatic');
  });

  it('should return automatic if Déchéance', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurinet',
    );

    expect(route).toBe('automatic');
  });

  it('should return simple if formation restreinte', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurinet',
    );

    expect(route).toBe('simple');
  });

  it('should return simple if Rejet non spécialement motivé', async () => {
    const route = await extractRoute(
      {
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
      idModule.lib.buildId(),
      'jurinet',
    );

    expect(route).toBe('simple');
  });

  it('should return exhaustive if has supplementaryAnnotations', async () => {
    const document = documentModule.generator.generate();
    const treatmentRepository = buildTreatmentRepository();
    await treatmentRepository.insert(
      treatmentModule.generator.generate({
        documentId: document._id,
        source: 'supplementaryAnnotations',
      }),
    );

    const route = await extractRoute(
      {
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
      document._id,
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });

  it('should return exhaustive even if Rejet non spécialement motivé because has supplementaryAnnotations', async () => {
    const document = documentModule.generator.generate();
    const treatmentRepository = buildTreatmentRepository();
    await treatmentRepository.insert(
      treatmentModule.generator.generate({
        documentId: document._id,
        source: 'supplementaryAnnotations',
      }),
    );

    const route = await extractRoute(
      {
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
      document._id,
      'jurinet',
    );

    expect(route).toBe('exhaustive');
  });
});
