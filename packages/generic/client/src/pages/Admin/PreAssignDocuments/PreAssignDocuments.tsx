import React from 'react';
import { apiRouteOutType } from '@label/core';
import { customThemeType, useCustomTheme, RefreshButton, tableRowFieldType } from 'pelta-design-system';
import { heights, widths } from '../../../styles';
import { PreAssignDocumentsTable } from './PreAssignDocumentsTable';

export { PreAssignDocuments };

function PreAssignDocuments(props: {
  preAssignations: apiRouteOutType<'get', 'preAssignations'>;
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
        <PreAssignDocumentsTable refetch={props.refetch} preAssignations={props.preAssignations} />
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