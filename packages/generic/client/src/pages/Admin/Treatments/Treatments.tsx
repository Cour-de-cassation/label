import React, { useState } from 'react';
import { uniq } from 'lodash';
import { apiRouteOutType, idModule, keysOf, treatmentInfoType, treatmentModule } from '@label/core';
import { AdminMenu, MainHeader, tableRowFieldType } from '../../../components';
import { timeOperator } from '../../../services/timeOperator';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { ExportCSVButton } from './ExportCSVButton';
import { Filters } from './Filters';
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
            console.log(treatmentsInfo);
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
                      <Filters
                        filterInfo={filterInfo}
                        filters={filters}
                        setFilters={setFilters}
                        resultsCount={filteredTreatmentsWithDetails.length}
                      />
                    </div>
                    <div style={styles.statisticsBoxContainer}>
                      <StatisticsBox treatmentsWithDetails={filteredTreatmentsWithDetails} />
                    </div>
                  </div>
                </div>
                <div style={styles.tableContentContainer}>
                  <TreatmentTable treatmentsWithDetails={filteredTreatmentsWithDetails} fields={treatmentFields} />
                </div>
                <div style={styles.csvButtonContainer}>
                  <ExportCSVButton data={filteredTreatmentsWithDetails} fields={treatmentFields} />
                </div>
              </div>
            );
          }}
        </TreatmentsDataFetcher>
      </div>
    </>
  );

  function getFilteredTreatmentsWithDetails(
    treatmentsWithDetails: apiRouteOutType<'get', 'treatmentsWithDetails'>,
    treatmentsInfo: Record<string, treatmentInfoType>,
    filters: treatmentFilterType,
  ) {
    return treatmentsWithDetails.filter((treatmentWithDetails) => {
      return keysOf(filters).reduce((accumulator, currentFilterKey) => {
        if (currentFilterKey === 'mustHaveSurAnnotations' && !!filters[currentFilterKey]) {
          const treatmentInfo = treatmentsInfo[idModule.lib.convertToString(treatmentWithDetails.treatment._id)];
          return accumulator && treatmentInfo.deletionsCount > 0;
        }
        if (currentFilterKey === 'mustHaveSubAnnotations' && !!filters[currentFilterKey]) {
          const treatmentInfo = treatmentsInfo[idModule.lib.convertToString(treatmentWithDetails.treatment._id)];
          return accumulator && treatmentInfo.additionsCount > 0;
        }
        if (currentFilterKey === 'startDate' && !!filters.startDate) {
          return accumulator && treatmentWithDetails.treatment.lastUpdateDate >= filters.startDate.getTime();
        }
        if (currentFilterKey === 'endDate' && !!filters.endDate) {
          return accumulator && treatmentWithDetails.treatment.lastUpdateDate <= filters.endDate.getTime();
        }
        if (currentFilterKey === 'userName' && !!filters[currentFilterKey]) {
          return accumulator && treatmentWithDetails.userName === filters.userName;
        }
        return accumulator;
      }, true as boolean);
    });
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
          timeOperator.convertTimestampToReadableDate(treatmentWithDetails.treatment.lastUpdateDate, true),
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
        id: 'resizeSmaller',
        title: wordings.treatmentsPage.table.columnTitles.resizeAnnotationSmaller,
        canBeSorted: true,
        extractor: (treatmentWithDetails) =>
          treatmentsInfo[idModule.lib.convertToString(treatmentWithDetails.treatment._id)].resizedSmallerCount,
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
        id: 'resizeBigger',
        title: wordings.treatmentsPage.table.columnTitles.resizeAnnotationBigger,
        canBeSorted: true,
        extractor: (treatmentWithDetails) =>
          treatmentsInfo[idModule.lib.convertToString(treatmentWithDetails.treatment._id)].resizedBiggerCount,
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
      leftHeaderContent: {
        flex: 1,
      },
      tableHeaderContainer: {
        height: heights.adminTreatmentsTableHeader,
      },
      statisticsBoxContainer: {
        marginTop: theme.spacing * 2,
      },
      tableHeader: {
        paddingTop: theme.spacing * 2,
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
