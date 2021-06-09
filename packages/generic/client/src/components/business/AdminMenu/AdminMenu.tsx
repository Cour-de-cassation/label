import React from 'react';
import { routes } from '../../../pages';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { MenuIcon } from './MenuIcon';

export { AdminMenu };

const OFFSET_TOP = 80;

function AdminMenu(props: { unreadProblemReportsCount: number }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <div style={styles.container}>
      <div style={styles.iconContainer}>
        <MenuIcon
          title={wordings.statisticsPage.header.subtitle}
          pathname={routes.STATISTICS.getPath()}
          iconName="home"
        />
        <MenuIcon
          title={wordings.untreatedDocumentsPage.header.subtitle}
          pathname={routes.UNTREATED_DOCUMENT.getPath()}
          iconName="playlistPlay"
        />
        <MenuIcon
          title={wordings.treatedDocumentsPage.header.subtitle}
          pathname={routes.TREATED_DOCUMENTS.getPath()}
          iconName="playlistCheck"
        />
        <MenuIcon
          title={wordings.problemReportsPage.header.subtitle}
          pathname={routes.PROBLEM_REPORTS.getPath()}
          alertCount={props.unreadProblemReportsCount}
          iconName="warning"
        />
        <MenuIcon title={wordings.agentsPage.header.subtitle} pathname={routes.AGENTS.getPath()} iconName="admin" />
      </div>
    </div>
  );
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
