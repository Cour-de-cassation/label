import React from 'react';
import { apiRouteOutType } from '@label/core';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { ProblemReportsTable } from './ProblemReportsTable';
import { wordings } from '../../../wordings';
import { IconButton } from '../../../components';

export { ProblemReports };

function ProblemReports(props: {
  problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>;
  refetch: () => void;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <div style={styles.table}>
      <div style={styles.tableHeaderContainer}>
        <div style={styles.tableHeader}>
          <IconButton
            backgroundColor="primary"
            onClick={props.refetch}
            hint={wordings.shared.refresh}
            iconName="reset"
          />
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
