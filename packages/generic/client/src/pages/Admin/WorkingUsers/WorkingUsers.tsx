import React from 'react';
import { apiRouteOutType } from '@label/core';
import { customThemeType, useCustomTheme, tableRowFieldType } from 'pelta-design-system';
import { heights, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { AddWorkingUserButton } from './AddUserDrawer/AddUserButton';
import { WorkingUsersTable } from './WorkingUsersTable';

export { WorkingUsers };

function WorkingUsers(props: { workingUsers: apiRouteOutType<'get', 'workingUsers'>; refetch: () => void }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const userFields = buildUserFields();
  return (
    <div style={styles.table}>
      <div style={styles.tableHeaderContainer}>
        <div style={styles.tableHeader}>
          <AddWorkingUserButton refetch={props.refetch} />
        </div>
      </div>
      <div style={styles.tableContentContainer}>
        <WorkingUsersTable refetch={props.refetch} workingUsers={props.workingUsers} fields={userFields} />
      </div>
    </div>
  );

  function buildUserFields() {
    const usersFields: Array<tableRowFieldType<apiRouteOutType<'get', 'workingUsers'>[number]>> = [
      {
        id: 'name',
        title: wordings.workingUsersPage.table.columnTitles.name,
        canBeSorted: true,
        extractor: (workingUser) => workingUser.name,
        width: 10,
      },
      {
        id: 'email',
        title: wordings.workingUsersPage.table.columnTitles.email,
        canBeSorted: true,
        extractor: (workingUser) => workingUser.email,
        width: 10,
      },
      {
        id: 'role',
        title: wordings.workingUsersPage.table.columnTitles.role,
        canBeSorted: true,
        extractor: (workingUser) => wordings.business.userRoles[workingUser.role],
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
