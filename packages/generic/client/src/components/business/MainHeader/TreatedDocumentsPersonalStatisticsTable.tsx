import React from 'react';
import dateFormat from 'dateformat';
import { Table, tableRowFieldType } from 'pelta-design-system';
import { apiRouteOutType } from '@label/core';
import { wordings } from '../../../wordings';

export { TreatedDocumentsPersonalStatisticsTable };

const PROBLEM_REPORT_TEXT_CELL_MAX_WIDTH = 400;

function TreatedDocumentsPersonalStatisticsTable(props: {
  refetch: () => void;
  personalStatistics: apiRouteOutType<'get', 'personalStatistics'>;
}) {
  const treatedDocumentsPersonalStatisticsFields = buildtreatedDocumentsPersonalStatisticsFields();

  return <Table data={props.personalStatistics} fields={treatedDocumentsPersonalStatisticsFields} />;

  function buildtreatedDocumentsPersonalStatisticsFields(): Array<
    tableRowFieldType<apiRouteOutType<'get', 'personalStatistics'>[number]>
  > {
    return [
      {
        id: 'day',
        canBeSorted: true,
        title: wordings.business.filters.columnTitles.treatmentDate,
        extractor: (personalStatistic) => dateFormat(personalStatistic.day, 'dd/mm'),
        width: 10,
        cellStyle: { maxWidth: `${PROBLEM_REPORT_TEXT_CELL_MAX_WIDTH}px`, overflow: 'hidden' },
      },
      {
        id: 'simple',
        canBeSorted: true,
        title: wordings.business.documentRoute.simple,
        extractor: (personalStatistic) => personalStatistic.simple,
        width: 10,
        cellStyle: { maxWidth: `${PROBLEM_REPORT_TEXT_CELL_MAX_WIDTH}px`, overflow: 'hidden' },
      },
      {
        id: 'exhaustive',
        canBeSorted: true,
        title: wordings.business.documentRoute.exhaustive,
        extractor: (personalStatistic) => personalStatistic.exhaustive,
        width: 10,
        cellStyle: { maxWidth: `${PROBLEM_REPORT_TEXT_CELL_MAX_WIDTH}px`, overflow: 'hidden' },
      },
      {
        id: 'total',
        canBeSorted: true,
        title: wordings.statisticsPage.box.computation.total,
        extractor: (personalStatistic) => personalStatistic.simple + personalStatistic.exhaustive,
        width: 10,
        cellStyle: { maxWidth: `${PROBLEM_REPORT_TEXT_CELL_MAX_WIDTH}px`, overflow: 'hidden' },
      },
    ];
  }
}
