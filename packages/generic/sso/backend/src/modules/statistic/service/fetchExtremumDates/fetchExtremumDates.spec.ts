import { statisticModule, treatmentModule } from '@label/core';
import { buildTreatmentRepository } from '../../../treatment';
import { buildStatisticRepository } from '../../repository';
import { fetchExtremumDates } from './fetchExtremumDates';

describe('fetchExtremumDates', () => {
  it('should fetch the statistic extremum dates if they are wider than treatments', async () => {
    const statisticRepository = buildStatisticRepository();
    const statistics = [
      {
        source: 'jurica',
        treatmentDate: 10,
      },
      {
        source: 'jurinet',
        treatmentDate: 50,
      },
    ].map(statisticModule.generator.generate);
    await statisticRepository.insertMany(statistics);
    const treatmentRepository = buildTreatmentRepository();
    const treatments = [
      {
        source: 'annotator' as const,
        lastUpdateDate: 20,
      },
      {
        source: 'admin' as const,
        lastUpdateDate: 30,
      },
    ].map(treatmentModule.generator.generate);
    await treatmentRepository.insertMany(treatments);

    const extremumDates = await fetchExtremumDates();

    expect(extremumDates).toEqual({ minDate: 10, maxDate: 50 });
  });

  it('should fetch the treatment extremum dates if they are wider than statistics', async () => {
    const statisticRepository = buildStatisticRepository();
    const statistics = [
      {
        source: 'jurica',
        treatmentDate: 20,
      },
      {
        source: 'jurinet',
        treatmentDate: 40,
      },
    ].map(statisticModule.generator.generate);
    await statisticRepository.insertMany(statistics);
    const treatmentRepository = buildTreatmentRepository();
    const treatments = [
      {
        source: 'annotator' as const,
        lastUpdateDate: 10,
      },
      {
        source: 'admin' as const,
        lastUpdateDate: 50,
      },
    ].map(treatmentModule.generator.generate);
    await treatmentRepository.insertMany(treatments);

    const extremumDates = await fetchExtremumDates();

    expect(extremumDates).toEqual({ minDate: 10, maxDate: 50 });
  });

  it('should fetch the treatment extremum dates if there are no statistics', async () => {
    const treatmentRepository = buildTreatmentRepository();
    const treatments = [
      {
        source: 'annotator' as const,
        lastUpdateDate: 10,
      },
      {
        source: 'admin' as const,
        lastUpdateDate: 50,
      },
    ].map(treatmentModule.generator.generate);
    await treatmentRepository.insertMany(treatments);

    const extremumDates = await fetchExtremumDates();

    expect(extremumDates).toEqual({ minDate: 10, maxDate: 50 });
  });

  it('should fetch the statistic extremum dates if there are no treatments', async () => {
    const statisticRepository = buildStatisticRepository();
    const statistics = [
      {
        source: 'jurica',
        treatmentDate: 10,
      },
      {
        source: 'jurinet',
        treatmentDate: 50,
      },
    ].map(statisticModule.generator.generate);
    await statisticRepository.insertMany(statistics);

    const extremumDates = await fetchExtremumDates();

    expect(extremumDates).toEqual({ minDate: 10, maxDate: 50 });
  });

  it('should fetch the mixed extremum dates', async () => {
    const statisticRepository = buildStatisticRepository();
    const statistics = [
      {
        source: 'jurica',
        treatmentDate: 10,
      },
      {
        source: 'jurinet',
        treatmentDate: 40,
      },
    ].map(statisticModule.generator.generate);
    await statisticRepository.insertMany(statistics);
    const treatmentRepository = buildTreatmentRepository();
    const treatments = [
      {
        source: 'annotator' as const,
        lastUpdateDate: 20,
      },
      {
        source: 'admin' as const,
        lastUpdateDate: 50,
      },
    ].map(treatmentModule.generator.generate);
    await treatmentRepository.insertMany(treatments);

    const extremumDates = await fetchExtremumDates();

    expect(extremumDates).toEqual({ minDate: 10, maxDate: 50 });
  });
});
