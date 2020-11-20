import React from 'react';
import { useCustomTheme, customThemeType } from '../../styles';
import { Icon, iconNameType } from '../generic';

export { ActionIcon };

function ActionIcon(props: { iconName: iconNameType; iconSize: number }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <div style={styles.actionIcon}>
      <Icon iconName={props.iconName} style={styles.icon} />
    </div>
  );

  function buildStyles(theme: customThemeType) {
    return {
      actionIcon: {
        width: props.iconSize,
        height: props.iconSize,
        borderRadius: props.iconSize / 2,
        backgroundColor: theme.colors.disabled.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      icon: {
        color: theme.colors.icon,
        fontSize: (props.iconSize * 2) / 3,
      },
    } as const;
  }
}
