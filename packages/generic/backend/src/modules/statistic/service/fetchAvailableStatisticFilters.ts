import { uniq } from 'lodash';
import { statisticType } from '@label/core';
import { documentService } from '../../document';
import { buildTreatmentRepository } from '../../treatment';
import { buildStatisticRepository } from '../repository';
import { logger } from '../../../utils';

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

async function fetchExtremumDates() {
  const statisticRepository = buildStatisticRepository();
  const treatmentRepository = buildTreatmentRepository();

  const maxDateStatistic = await statisticRepository.findExtremumField(
    { source: 'annotator' },
    'treatmentDate',
    'max',
  );

  logger.log('maxDateStatistic');
  logger.log(maxDateStatistic?.treatmentDate);

  const minDateStatistic = await statisticRepository.findExtremumField(
    { source: 'annotator' },
    'treatmentDate',
    'min',
  );

  logger.log('minDateStatistic');
  logger.log(minDateStatistic?.treatmentDate);

  const maxDateTreatment = await treatmentRepository.findExtremumField(
    { source: 'annotator' },
    'lastUpdateDate',
    'max',
  );

  logger.log('maxDateTreatment');
  logger.log(maxDateTreatment?.lastUpdateDate);

  const minDateTreatment = await treatmentRepository.findExtremumField(
    { source: 'annotator' },
    'lastUpdateDate',
    'min',
  );

  logger.log('minDateTreatment');
  logger.log(minDateTreatment?.lastUpdateDate);

  const minDate = Math.min(
    minDateStatistic ? minDateStatistic.treatmentDate : Infinity,
    minDateTreatment ? minDateTreatment.lastUpdateDate : Infinity,
  );

  logger.log(`minDate: ${minDate}`);
  const maxDate = Math.max(
    maxDateStatistic ? maxDateStatistic.treatmentDate : 0,
    maxDateTreatment ? maxDateTreatment.lastUpdateDate : 0,
  );
  logger.log(`maxDate: ${maxDate}`);

  return {
    minDate: minDate !== Infinity ? minDate : undefined,
    maxDate: maxDate !== 0 ? maxDate : undefined,
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
