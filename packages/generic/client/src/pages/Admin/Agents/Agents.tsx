import React from 'react';
import { apiRouteOutType } from '@label/core';
import { AdminMenu, MainHeader, tableRowFieldType } from '../../../components';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { AgentsDataFetcher } from './AgentsDataFetcher';
import { AgentsTable } from './AgentsTable';

export { Agents };

function Agents() {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const userFields = buildUserFields();
  return (
    <>
      <div style={styles.header}>
        <MainHeader title={wordings.agentsPage.title} subtitle={wordings.agentsPage.subtitle} />
      </div>
      <div style={styles.contentContainer}>
        <AdminMenu />
        <AgentsDataFetcher>
          {({ usersWithDetails }) => {
            return (
              <div style={styles.table}>
                <div style={styles.tableHeaderContainer}>
                  <div style={styles.tableHeader}></div>
                </div>
                <div style={styles.tableContentContainer}>
                  <AgentsTable usersWithDetails={usersWithDetails} fields={userFields} />
                </div>
              </div>
            );
          }}
        </AgentsDataFetcher>
      </div>
    </>
  );

  function buildUserFields() {
    const usersFields: Array<tableRowFieldType<apiRouteOutType<'get', 'usersWithDetails'>[number], string | number>> = [
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
      header: {
        height: heights.header,
      },
      contentContainer: {
        width: '100vw',
        display: 'flex',
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
