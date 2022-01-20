import React from 'react';
import { apiRouteOutType } from '@label/core';
import { customThemeType, useCustomTheme, RefreshButton } from 'pelta-design-system';
import { heights, widths } from '../../../styles';
import { ProblemReportsTable } from './ProblemReportsTable';

export { ProblemReports };

function ProblemReports(props: {
  problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>;
  refetch: () => void;
  isLoading: boolean;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <div style={styles.table}>
      <div style={styles.tableHeaderContainer}>
        <div style={styles.tableHeader}>
          <RefreshButton onClick={props.refetch} isLoading={props.isLoading} />
        </div>
      </div>
      <div style={styles.tableContentContainer}>
        <ProblemReportsTable refetch={props.refetch} problemReportsWithDetails={props.problemReportsWithDetails} />
      </div>
    </div>
  );
}

function buildStyles(theme: customThemeType) {
  return {
    tableHeaderContainer: {
      height: heights.adminTreatmentsTableHeader,
    },
    tableHeader: {
      paddingTop: theme.spacing * 5,
      paddingRight: theme.spacing * 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
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
