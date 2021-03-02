import React, { useState } from 'react';
import { apiRouteOutType, idModule, treatmentModule } from '@label/core';
import { AdminMenu, ButtonWithIcon, MainHeader, tableRowFieldType } from '../../../components';
import { timeOperator } from '../../../services/timeOperator';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { Chip } from './Chip';
import { ExportCSVButton } from './ExportCSVButton';
import { StatisticsBox } from './StatisticsBox';
import { TreatmentsDataFetcher } from './TreatmentsDataFetcher';
import { TreatmentTable } from './TreatmentTable';

export { Treatments };

const FILTER_TEXT = 'Du 22/01/2021 au 22/01/2021';

function Treatments() {
  const theme = useCustomTheme();
  const [filters, setFilters] = useState<string[]>([]);
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
            const treatmentFields = buildTreatmentFields(treatmentsWithDetails);

            return (
              <div style={styles.table}>
                <div style={styles.tableHeaderContainer}>
                  <div style={styles.tableHeader}>
                    <div style={styles.filterContainer}>
                      <ButtonWithIcon
                        onClick={() => setFilters([FILTER_TEXT])}
                        iconName="filter"
                        text={wordings.treatmentsPage.table.filter.title}
                      />
                      <div style={styles.chipsContainer}>
                        {filters.map((filter) => (
                          <Chip filterText={filter} onClose={buildRemoveFilter(FILTER_TEXT)} />
                        ))}
                      </div>
                    </div>
                    <StatisticsBox treatmentsWithDetails={treatmentsWithDetails} />
                  </div>
                </div>
                <div style={styles.tableContentContainer}>
                  <TreatmentTable treatmentsWithDetails={treatmentsWithDetails} fields={treatmentFields} />
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

  function buildRemoveFilter(filterToRemove: string) {
    return () => setFilters(filters.filter((filter) => filter !== filterToRemove));
  }

  function buildTreatmentFields(treatmentsWithDetails: apiRouteOutType<'get', 'treatmentsWithDetails'>) {
    const treatmentsInfo = treatmentModule.lib.computeTreatmentsInfo(
      treatmentsWithDetails.map(({ treatment }) => treatment),
    );

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
      },
      filterContainer: {
        flex: 1,
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
