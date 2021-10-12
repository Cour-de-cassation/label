import { uniq } from 'lodash';
import { statisticType } from '@label/core';
import { documentService } from '../../document';
import { buildStatisticRepository } from '../repository';
import { fetchExtremumDates } from './fetchExtremumDates';

export { fetchAvailableStatisticFilters };

async function fetchAvailableStatisticFilters() {
  const statisticRepository = buildStatisticRepository();

  const statisticFields = await statisticRepository.findAllProjection([
    'publicationCategory',
    'source',
    'jurisdiction',
  ]);

  const { minDate, maxDate } = await fetchExtremumDates();

  return {
    minDate,
    maxDate,
    jurisdictions: await fetchAvailableJurisdictionFilters(statisticFields),
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

async function fetchAvailableJurisdictionFilters(
  statisticFields: Array<{
    jurisdiction: statisticType['jurisdiction'];
  }>,
) {
  const statisticJurisdictions = statisticFields.reduce(
    (accumulator, { jurisdiction }) =>
      jurisdiction ? [...accumulator, jurisdiction] : accumulator,
    [] as string[],
  );
  const documentJurisdictions = await documentService.fetchAllJurisdictions();

  return uniq([...statisticJurisdictions, ...documentJurisdictions]).sort();
}
