import React from 'react';
import { customThemeType, useCustomTheme, Icon, Text } from 'pelta-design-system';

export { Chip };

const ICON_SIZE = 24;

function Chip(props: { label: string; onClose: () => void }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <div style={styles.container}>
      <div style={styles.textContainer}>
        <Text variant="h3">{props.label}</Text>
      </div>
      <div style={styles.iconContainer} onClick={props.onClose}>
        <Icon iconName="close" style={styles.icon} />
      </div>
    </div>
  );
}

function buildStyles(theme: customThemeType) {
  return {
    container: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: theme.colors.primary.background,
      paddingLeft: theme.spacing * 2,
      paddingRight: theme.spacing,
      borderRadius: theme.shape.borderRadius.xs,
    },
    textContainer: {
      paddingRight: theme.spacing,
    },
    iconContainer: {
      display: 'flex',
      cursor: 'pointer',
    },
    icon: { fontSize: ICON_SIZE },
  };
}
