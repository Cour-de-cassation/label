import React from 'react';
import { customThemeType, heights, useCustomTheme } from '../../../styles';
import { ProblemReportsDataFetcher } from './ProblemReportsDataFetcher';
import { ProblemReportsTable } from './ProblemReportsTable';

export { ProblemReports };

function ProblemReports() {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <ProblemReportsDataFetcher>
      {({ problemReports }) => (
        <div style={styles.table}>
          <div style={styles.tableHeaderContainer}>
            <div style={styles.tableHeader}></div>
          </div>
          <div style={styles.tableContentContainer}>
            <ProblemReportsTable problemReports={problemReports} />
          </div>
        </div>
      )}
    </ProblemReportsDataFetcher>
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
      paddingLeft: theme.spacing * 3,
      paddingRight: theme.spacing * 2,
    },
  } as const;
}
