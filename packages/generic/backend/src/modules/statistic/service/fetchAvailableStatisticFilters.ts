import { uniq } from 'lodash';
import { statisticType } from '@label/core';
import { documentService } from '../../document';
import { buildStatisticRepository } from '../repository';

export { fetchAvailableStatisticFilters };

async function fetchAvailableStatisticFilters() {
  const statisticRepository = buildStatisticRepository();

  const statisticFields = await statisticRepository.findAllProjection([
    'publicationCategory',
    'source',
  ]);

  return {
    publicationCategories: await fetchAvailablePublicationCategoryFilters(
      statisticFields,
    ),
    sources: await fetchAvailableSourceFilters(statisticFields),
  };
}

async function fetchAvailablePublicationCategoryFilters(
  statisticFields: Array<{
    publicationCategory: statisticType['publicationCategory'];
  }>,
) {
  let statisticPublicationCategories: string[] = [];
  statisticFields.forEach(
    ({ publicationCategory }) =>
      (statisticPublicationCategories = uniq(
        statisticPublicationCategories.concat(publicationCategory),
      )),
  );

  const documentPublicationCategories = await documentService.fetchAllPublicationCategories();

  return uniq(
    statisticPublicationCategories.concat(documentPublicationCategories),
  ).sort();
}

async function fetchAvailableSourceFilters(
  statisticFields: Array<{
    source: statisticType['source'];
  }>,
) {
  const statisticSources = statisticFields.map(({ source }) => source);
  const documentSources = await documentService.fetchAllSources();

  return uniq([...statisticSources, ...documentSources]).sort();
}
