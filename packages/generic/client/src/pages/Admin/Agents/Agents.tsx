import React from 'react';
import { apiRouteOutType } from '@label/core';
import { tableRowFieldType } from '../../../components';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { AgentsTable } from './AgentsTable';
import { AddAgentButton } from './AddAgentDrawer/AddAgentButton';

export { Agents };

function Agents(props: { usersWithDetails: apiRouteOutType<'get', 'usersWithDetails'>; refetch: () => void }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const userFields = buildUserFields();
  return (
    <div style={styles.table}>
      <div style={styles.tableHeaderContainer}>
        <div style={styles.tableHeader}>
          <AddAgentButton refetch={props.refetch} />
        </div>
      </div>
      <div style={styles.tableContentContainer}>
        <AgentsTable refetch={props.refetch} usersWithDetails={props.usersWithDetails} fields={userFields} />
      </div>
    </div>
  );

  function buildUserFields() {
    const usersFields: Array<tableRowFieldType<apiRouteOutType<'get', 'usersWithDetails'>[number]>> = [
      {
        id: 'name',
        title: wordings.agentsPage.table.columnTitles.name,
        canBeSorted: true,
        extractor: (userWithDetails) => userWithDetails.user.name,
        width: 10,
      },
      {
        id: 'email',
        title: wordings.agentsPage.table.columnTitles.email,
        canBeSorted: true,
        extractor: (userWithDetails) => userWithDetails.user.email,
        width: 10,
      },
      {
        id: 'role',
        title: wordings.agentsPage.table.columnTitles.role,
        canBeSorted: true,
        extractor: (userWithDetails) => wordings.agentsPage.table.roles[userWithDetails.user.role],
        width: 10,
      },
    ];
    return usersFields;
  }

  function buildStyles(theme: customThemeType) {
    return {
      tableHeaderContainer: {
        height: heights.adminTreatmentsTableHeader,
      },
      tableHeader: {
        paddingTop: theme.spacing * 4,
        display: 'flex',
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
}
