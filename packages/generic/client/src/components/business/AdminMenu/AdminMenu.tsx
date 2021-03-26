import React from 'react';
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
          title={wordings.untreatedDocumentsPage.header.subtitle}
          pathname="/admin/untreated-documents"
          iconName="playlistPlay"
        />
        <MenuIcon
          title={wordings.treatedDocumentsPage.header.subtitle}
          pathname="/admin/treated-documents"
          iconName="playlistCheck"
        />
        <MenuIcon
          title={wordings.problemReportsPage.header.subtitle}
          pathname="/admin/problem-reports"
          alertCount={props.unreadProblemReportsCount}
          iconName="warning"
        />
        <MenuIcon title={wordings.agentsPage.header.subtitle} pathname="/admin/agents" iconName="admin" />
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
