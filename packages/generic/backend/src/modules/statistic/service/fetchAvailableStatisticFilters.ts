import { uniq } from 'lodash';
import { documentService } from '../../document';
import { buildStatisticRepository } from '../repository';

export { fetchAvailableStatisticFilters };

async function fetchAvailableStatisticFilters() {
  return {
    sources: await fetchAvailableSourceFilters(),
  };
}

async function fetchAvailableSourceFilters() {
  const statisticRepository = buildStatisticRepository();

  const statisticSources = (
    await statisticRepository.findAllProjection(['source'])
  ).map(({ source }) => source);
  const documentSources = await documentService.fetchAllSources();

  return uniq([...statisticSources, ...documentSources]).sort();
}
