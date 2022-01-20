import React from 'react';
import { customThemeType, useCustomTheme, Text } from 'pelta-design-system';

export { AlertBadge };

const BADGE_SIZE = 22;

function AlertBadge(props: { count: number }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <div style={styles.container}>
      <Text variant="h3" style={styles.count}>
        {props.count}
      </Text>
    </div>
  );
}

function buildStyles(theme: customThemeType) {
  return {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.alert.background,
      width: BADGE_SIZE,
      height: BADGE_SIZE,
      borderRadius: BADGE_SIZE / 2,
    },
    count: {
      color: theme.colors.line.level1,
      paddingTop: '3px',
    },
  };
}
