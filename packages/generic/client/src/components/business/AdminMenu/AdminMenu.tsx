import React from 'react';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { MenuIcon } from './MenuIcon';

export { AdminMenu };

const OFFSET_TOP = 80;

function AdminMenu() {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <div style={styles.container}>
      <div style={styles.iconContainer}>
        <MenuIcon pathname="/admin/untreated-documents" iconName="playlistPlay" />
        <MenuIcon pathname="/admin/treatments" iconName="playlistCheck" />
        <MenuIcon pathname="/admin/problem-reports" iconName="warning" />
        <MenuIcon pathname="/admin/agents" iconName="admin" />
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
