import React from 'react';
import { Icon, Text } from '../../../components';
import { customThemeType, useCustomTheme } from '../../../styles';

export { Chip };

const ICON_SIZE = 16;

function Chip(props: { filterText: string; onClose: () => void }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  return (
    <div style={styles.container}>
      <div style={styles.textContainer}>
        <Text variant="h3">{props.filterText}</Text>
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
      padding: theme.spacing,
      borderRadius: theme.shape.borderRadius.xxs,
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
