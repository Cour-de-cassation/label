import React from 'react';
import { AdminMenu, MainHeader, Text } from '../../../components';
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
        <MainHeader
          title={wordings.problemReportsPage.title}
          subtitle={<Text>{wordings.problemReportsPage.subtitle}</Text>}
        />
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
      display: 'flex',
      width: '100vw',
      height: heights.adminPanel,
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
      width: widths.adminContent,
      paddingLeft: theme.spacing * 3,
      paddingRight: theme.spacing * 2,
    },
  } as const;
}
