import React from 'react';
import { apiRouteOutType, userType } from '@label/core';
import { customThemeType, useCustomTheme, RefreshButton } from 'pelta-design-system';
import { heights, widths } from '../../../styles';
import { PreAssignDocumentsTable } from './PreAssignDocumentsTable';
import { AddPreAssignationButton } from './AddPreAssignationDrawer/AddPreAssignationButton';
import { localStorage } from '../../../services/localStorage';

export { PreAssignDocuments };

function PreAssignDocuments(props: {
  users: Array<Pick<userType, '_id' | 'name'>>;
  preAssignations: apiRouteOutType<'get', 'preAssignations'>;
  refetch: () => void;
  isLoading: boolean;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  const userRole = localStorage.userHandler.getRole();

  return (
    <div style={styles.table}>
      <div style={styles.tableHeaderContainer}>
        <div style={styles.tableHeader}>
          {userRole === 'admin' && (
            <div style={styles.addPreAssignationButton}>
              <AddPreAssignationButton refetch={props.refetch} users={props.users} />
            </div>
          )}
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
    addPreAssignationButton: {
      marginRight: theme.spacing * 2,
    },
  } as const;
}
