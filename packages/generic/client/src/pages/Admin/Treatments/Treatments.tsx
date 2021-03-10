import React, { useState } from 'react';
import { uniq } from 'lodash';
import { apiRouteOutType, idModule, keysOf, treatmentInfoType, treatmentModule } from '@label/core';
import { AdminMenu, MainHeader, tableRowFieldType } from '../../../components';
import { timeOperator } from '../../../services/timeOperator';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { Chip } from './Chip';
import { ExportCSVButton } from './ExportCSVButton';
import { FilterButton } from './FilterButton';
import { StatisticsBox } from './StatisticsBox';
import { TreatmentsDataFetcher } from './TreatmentsDataFetcher';
import { TreatmentTable } from './TreatmentTable';
import { DEFAULT_TREATMENT_FILTER, treatmentFilterType } from './FilterButton';

export { Treatments };

function Treatments() {
  const theme = useCustomTheme();
  const [filters, setFilters] = useState<treatmentFilterType>(DEFAULT_TREATMENT_FILTER);
  const styles = buildStyles(theme);
  return (
    <>
      <div style={styles.header}>
        <MainHeader title={wordings.treatmentsPage.title} subtitle={wordings.treatmentsPage.subtitle} />
      </div>
      <div style={styles.contentContainer}>
        <AdminMenu />
        <TreatmentsDataFetcher>
          {({ treatmentsWithDetails }) => {
            const treatmentsInfo = treatmentModule.lib.computeTreatmentsInfo(
              treatmentsWithDetails.map(({ treatment }) => treatment),
            );
            const treatmentFields = buildTreatmentFields(treatmentsInfo);
            const filterInfo = extractFilterInfoFromTreatments(treatmentsWithDetails);
            const filteredTreatmentsWithDetails = getFilteredTreatmentsWithDetails(
              treatmentsWithDetails,
              treatmentsInfo,
              filters,
            );

            return (
              <div style={styles.table}>
                <div style={styles.tableHeaderContainer}>
                  <div style={styles.tableHeader}>
                    <div style={styles.leftHeaderContent}>
                      <div style={styles.filterContainer}>
                        <FilterButton filters={filters} setFilters={setFilters} filterInfo={filterInfo} />
                        <div style={styles.chipsContainer}>
                          {keysOf(filters).map((filterKey) => renderFilterChip(filterKey, filters))}
                        </div>
                      </div>
                    </div>
                    <StatisticsBox treatmentsWithDetails={filteredTreatmentsWithDetails} />
                  </div>
                </div>
                <div style={styles.tableContentContainer}>
                  <TreatmentTable treatmentsWithDetails={filteredTreatmentsWithDetails} fields={treatmentFields} />
                </div>
                <div style={styles.csvButtonContainer}>
                  <ExportCSVButton data={treatmentsWithDetails} fields={treatmentFields} />
                </div>
              </div>
            );
          }}
        </TreatmentsDataFetcher>
      </div>
    </>
  );

  function renderFilterChip(filterKey: keyof treatmentFilterType, filters: treatmentFilterType) {
    switch (filterKey) {
      case 'mustHaveSurAnnotations':
        return renderMustHaveSurAnnotationsChip(filters.mustHaveSurAnnotations);
      case 'userName':
        return renderUserNameChip(filters.userName);
    }

    function renderMustHaveSurAnnotationsChip(filterValue: boolean) {
      return (
        !!filterValue && (
          <div style={styles.chipContainer}>
            <Chip
              filterText={wordings.treatmentsPage.table.filter.chips.mustHaveSurAnnotations}
              onClose={buildRemoveFilter(filterKey)}
            />
          </div>
        )
      );
    }

    function renderUserNameChip(filterValue: string | undefined) {
      return (
        !!filterValue && (
          <div style={styles.chipContainer}>
            <Chip filterText={filterValue} onClose={buildRemoveFilter(filterKey)} />
          </div>
        )
      );
    }
  }

  function getFilteredTreatmentsWithDetails(
    treatmentsWithDetails: apiRouteOutType<'get', 'treatmentsWithDetails'>,
    treatmentsInfo: Record<string, treatmentInfoType>,
    filters: treatmentFilterType,
  ) {
    return treatmentsWithDetails.filter((treatmentWithDetails) => {
      return Object.entries(filters).reduce((accumulator, [currentFilterKey, currentFilterValue]) => {
        if (currentFilterKey === 'userName' && !!currentFilterValue) {
          return accumulator && treatmentWithDetails.userName === filters.userName;
        }
        if (currentFilterKey === 'mustHaveSurAnnotations' && !!currentFilterValue) {
          const treatmentInfo = treatmentsInfo[idModule.lib.convertToString(treatmentWithDetails.treatment._id)];
          return accumulator && treatmentInfo.deletionsCount > 0;
        }
        return accumulator;
      }, true as boolean);
    });
  }

  function buildRemoveFilter(filterKeyToRemove: string) {
    return () => setFilters({ ...filters, [filterKeyToRemove]: undefined });
  }

  function extractFilterInfoFromTreatments(treatmentsWithDetails: apiRouteOutType<'get', 'treatmentsWithDetails'>) {
    const userNames = uniq(treatmentsWithDetails.map((treatmentWithDetails) => treatmentWithDetails.userName));
    return { userNames };
  }

  function buildTreatmentFields(treatmentsInfo: Record<string, treatmentInfoType>) {
    const treatmentsFields: Array<tableRowFieldType<
      apiRouteOutType<'get', 'treatmentsWithDetails'>[number],
      string | number
    >> = [
      {
        id: 'documentId',
        title: wordings.treatmentsPage.table.columnTitles.number,
        canBeSorted: true,
        extractor: (treatmentWithDetails) => JSON.stringify(treatmentWithDetails.documentId),
        width: 10,
      },
      {
        id: 'userName',
        title: wordings.treatmentsPage.table.columnTitles.agent,
        canBeSorted: true,
        extractor: (treatmentWithDetails) => treatmentWithDetails.userName,
        width: 10,
      },
      {
        id: 'date',
        title: wordings.treatmentsPage.table.columnTitles.date,
        canBeSorted: true,
        extractor: (treatmentWithDetails) =>
          timeOperator.convertTimestampToReadableDate(treatmentWithDetails.treatment.lastUpdateDate),
        width: 10,
      },
      {
        id: 'deletions',
        title: wordings.treatmentsPage.table.columnTitles.surAnnotation,
        canBeSorted: true,
        extractor: (treatmentWithDetails) =>
          treatmentsInfo[idModule.lib.convertToString(treatmentWithDetails.treatment._id)].deletionsCount,
        width: 3,
      },
      {
        id: 'additions',
        title: wordings.treatmentsPage.table.columnTitles.subAnnotation,
        canBeSorted: true,
        extractor: (treatmentWithDetails) =>
          treatmentsInfo[idModule.lib.convertToString(treatmentWithDetails.treatment._id)].additionsCount,
        width: 3,
      },
      {
        id: 'modifications',
        title: wordings.treatmentsPage.table.columnTitles.changeAnnotation,
        canBeSorted: true,
        extractor: (treatmentWithDetails) =>
          treatmentsInfo[idModule.lib.convertToString(treatmentWithDetails.treatment._id)].modificationsCount,
        width: 3,
      },
      {
        id: 'duration',
        canBeSorted: true,
        title: wordings.treatmentsPage.table.columnTitles.duration,
        extractor: (treatmentWithDetails) =>
          timeOperator.convertDurationToReadableDuration(treatmentWithDetails.treatment.duration),
        width: 3,
      },
    ];
    return treatmentsFields;
  }

  function buildStyles(theme: customThemeType) {
    return {
      header: {
        height: heights.header,
      },
      csvButtonContainer: {
        position: 'fixed',
        bottom: theme.spacing,
        right: theme.spacing * 2,
      },
      contentContainer: {
        width: '100vw',
        display: 'flex',
      },
      chipsContainer: {
        paddingTop: theme.spacing,
        paddingBottom: theme.spacing,
        paddingLeft: theme.spacing,
        display: 'flex',
        flex: 1,
      },
      chipContainer: {
        marginRight: theme.spacing,
      },
      leftHeaderContent: {
        flex: 1,
      },
      filterContainer: {
        display: 'flex',
      },
      tableHeaderContainer: {
        height: heights.adminTreatmentsTableHeader,
      },
      tableHeader: {
        paddingTop: theme.spacing * 4,
        display: 'flex',
        justifyContent: 'space-between',
      },
      tableContentContainer: {
        height: heights.adminTreatmentsTable,
        overflowY: 'auto',
      },
      table: {
        height: heights.adminPanel,
        width: widths.adminContent,
        paddingLeft: theme.spacing * 3,
        paddingRight: theme.spacing * 2,
      },
    } as const;
  }
}
