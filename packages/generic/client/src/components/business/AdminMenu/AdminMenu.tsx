import React from 'react';
import { routes } from '../../../pages';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { MenuIcon } from './MenuIcon';

export { AdminMenu };

const OFFSET_TOP = 80;

function AdminMenu(props: { unreadProblemReportsCount: number; userRole: 'admin' | 'scrutator' }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  const menuIcons = getMenuIcons(props.unreadProblemReportsCount);

  return (
    <div style={styles.container}>
      <div style={styles.iconContainer}>{menuIcons[props.userRole]}</div>
    </div>
  );
}

function getMenuIcons(unreadProblemReportsCount: number) {
  const STATISTICS_ICON = (
    <MenuIcon title={wordings.statisticsPage.header.subtitle} pathname={routes.STATISTICS.getPath()} iconName="home" />
  );

  const UNTREATED_DOCUMENT_ICON = (
    <MenuIcon
      title={wordings.untreatedDocumentsPage.header.subtitle}
      pathname={routes.UNTREATED_DOCUMENT.getPath()}
      iconName="playlistPlay"
    />
  );

  const TREATED_DOCUMENTS_ICON = (
    <MenuIcon
      title={wordings.treatedDocumentsPage.header.subtitle}
      pathname={routes.TREATED_DOCUMENTS.getPath()}
      iconName="playlistCheck"
    />
  );

  const PROBLEM_REPORTS_ICON = (
    <MenuIcon
      title={wordings.problemReportsPage.header.subtitle}
      pathname={routes.PROBLEM_REPORTS.getPath()}
      alertCount={unreadProblemReportsCount}
      iconName="warning"
    />
  );

  const WORKING_USERS_ICON = (
    <MenuIcon
      title={wordings.workingUsersPage.header.subtitle}
      pathname={routes.WORKING_USERS.getPath()}
      iconName="admin"
    />
  );

  return {
    admin: [STATISTICS_ICON, UNTREATED_DOCUMENT_ICON, TREATED_DOCUMENTS_ICON, PROBLEM_REPORTS_ICON, WORKING_USERS_ICON],
    scrutator: [STATISTICS_ICON, UNTREATED_DOCUMENT_ICON, TREATED_DOCUMENTS_ICON],
  };
}

function buildStyles(theme: customThemeType) {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      width: widths.adminMenu,
      height: heights.adminPanel,
      backgroundColor: theme.colors.default.background,
    },
    iconContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      width: widths.adminMenu,
      paddingTop: OFFSET_TOP,
      backgroundColor: theme.colors.default.background,
    },
  } as const;
}
