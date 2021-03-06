import React from 'react';
import { AdminMenu, MainHeader } from '../../../components';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { ProblemReportsDataFetcher } from './ProblemReportsDataFetcher';
import { ProblemReportsTable } from './ProblemReportsTable';

export { ProblemReports };

function ProblemReports() {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <>
      <div style={styles.header}>
        <MainHeader title={wordings.problemReportsPage.title} subtitle={wordings.problemReportsPage.subtitle} />
      </div>
      <div style={styles.contentContainer}>
        <AdminMenu />
        <ProblemReportsDataFetcher>
          {({ problemReportsWithDetails }) => (
            <div style={styles.table}>
              <div style={styles.tableHeaderContainer}>
                <div style={styles.tableHeader}></div>
              </div>
              <div style={styles.tableContentContainer}>
                <ProblemReportsTable problemReportsWithDetails={problemReportsWithDetails} />
              </div>
            </div>
          )}
        </ProblemReportsDataFetcher>
      </div>
    </>
  );
}

function buildStyles(theme: customThemeType) {
  return {
    header: {
      height: heights.header,
    },
    tableHeaderContainer: {
      height: heights.adminTreatmentsTableHeader,
    },
    contentContainer: {
      width: '100vw',
      display: 'flex',
    },
    tableHeader: {
      paddingTop: theme.spacing * 2,
      paddingRight: theme.spacing,
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
