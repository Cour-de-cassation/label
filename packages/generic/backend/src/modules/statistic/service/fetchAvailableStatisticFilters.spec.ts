import { documentModule, statisticModule } from '@label/core';
import { buildDocumentRepository } from '../../document';
import { buildStatisticRepository } from '../repository';
import { fetchAvailableStatisticFilters } from './fetchAvailableStatisticFilters';

describe('fetchAvailableStatisticFilters', () => {
  const documentRepository = buildDocumentRepository();
  const statisticRepository = buildStatisticRepository();

  it('should fetch all the sources available', async () => {
    const documents = [{ source: 'DOC_SOURCE_1' }].map(
      documentModule.generator.generate,
    );
    const statistics = [
      {
        source: 'STAT_SOURCE_1',
      },
      { source: 'STAT_SOURCE_2' },
    ].map(statisticModule.generator.generate);
    await Promise.all(documents.map(documentRepository.insert));
    await Promise.all(statistics.map(statisticRepository.insert));

    const availableStatisticFilters = await fetchAvailableStatisticFilters();

    expect(availableStatisticFilters.sources).toEqual([
      'DOC_SOURCE_1',
      'STAT_SOURCE_1',
      'STAT_SOURCE_2',
    ]);
  });
});
