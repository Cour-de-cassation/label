import React from 'react';
import { customThemeType, heights, useCustomTheme } from 'pelta-design-system';
import { routes } from '../../../pages';
import { widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { MenuIcon } from './MenuIcon';

export { AdminMenu };

const OFFSET_TOP = 15;

function AdminMenu(props: {
  unreadProblemReportsCount: number;
  toBeConfirmedDocumentsCount: number;
  userRole: 'admin' | 'scrutator';
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  const menuIcons = getMenuIcons({
    unreadProblemReportsCount: props.unreadProblemReportsCount,
    toBeConfirmedDocumentsCount: props.toBeConfirmedDocumentsCount,
  });

  return (
    <div style={styles.container}>
      <div style={styles.iconContainer}>{menuIcons[props.userRole]}</div>
    </div>
  );
}

function getMenuIcons({
  unreadProblemReportsCount,
  toBeConfirmedDocumentsCount,
}: {
  unreadProblemReportsCount: number;
  toBeConfirmedDocumentsCount: number;
}) {
  const SUMMARY_ICON = (
    <MenuIcon title={wordings.summaryPage.header.subtitle} pathname={routes.SUMMARY.getPath()} iconName="home" />
  );

  const STATISTICS_ICON = (
    <MenuIcon
      title={wordings.statisticsPage.header.subtitle}
      pathname={routes.STATISTICS.getPath()}
      iconName="statistics"
    />
  );

  const UNTREATED_DOCUMENT_ICON = (
    <MenuIcon
      title={wordings.untreatedDocumentsPage.header.subtitle}
      pathname={routes.UNTREATED_DOCUMENT.getPath()}
      iconName="playlistPlay"
    />
  );

  const TO_BE_CONFIRMED_DOCUMENTS_ICON = (
    <MenuIcon
      title={wordings.toBeConfirmedDocumentsPage.header.subtitle}
      pathname={routes.TO_BE_CONFIRMED_DOCUMENTS.getPath()}
      alertCount={toBeConfirmedDocumentsCount}
      iconName="checkBox"
    />
  );

  const TREATED_DOCUMENTS_ICON = (
    <MenuIcon
      title={wordings.treatedDocumentsPage.header.subtitle}
      pathname={routes.TREATED_DOCUMENTS.getPath()}
      iconName="doubleCheck"
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
    admin: [
      SUMMARY_ICON,
      STATISTICS_ICON,
      UNTREATED_DOCUMENT_ICON,
      TO_BE_CONFIRMED_DOCUMENTS_ICON,
      TREATED_DOCUMENTS_ICON,
      PROBLEM_REPORTS_ICON,
      WORKING_USERS_ICON,
    ],
    scrutator: [
      SUMMARY_ICON,
      STATISTICS_ICON,
      UNTREATED_DOCUMENT_ICON,
      TO_BE_CONFIRMED_DOCUMENTS_ICON,
      TREATED_DOCUMENTS_ICON,
      PROBLEM_REPORTS_ICON,
    ],
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
