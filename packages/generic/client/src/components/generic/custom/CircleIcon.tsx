import React from 'react';
import { Icon, iconNameType } from '../materialUI';
import { customThemeType, useCustomTheme } from '../../../styles';

export { CircleIcon };

function CircleIcon(props: { backgroundColor: string; iconSize: number; iconName: iconNameType; hint?: string }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <div style={styles.iconContainer}>
      <Icon hint={props.hint} iconName={props.iconName} style={styles.icon} />
    </div>
  );

  function buildStyles(theme: customThemeType) {
    return {
      iconContainer: {
        width: props.iconSize,
        height: props.iconSize,
        borderRadius: props.iconSize / 2,
        backgroundColor: props.backgroundColor,
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
