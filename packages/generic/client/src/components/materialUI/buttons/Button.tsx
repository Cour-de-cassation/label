import React, { CSSProperties, ReactElement, ReactNode, MouseEvent } from 'react';
import { Button as MUButton, Theme, useTheme } from '@material-ui/core';
import { iconNameType, Icon } from '../icons';

export { Button };

function Button(props: {
  children?: ReactNode;
  color?: 'primary' | 'secondary' | 'default';
  onClick: (event: MouseEvent) => void;
  style?: CSSProperties;
  iconName?: iconNameType;
  disabled?: boolean;
}): ReactElement {
  const theme = useTheme();
  const styles = buildStyles(theme);

  return (
    <MUButton
      variant="contained"
      color={props.color}
      onClick={props.onClick}
      disabled={props.disabled}
      style={{ ...styles.button, ...props.style }}
    >
      {!!props.iconName && (
        <div style={styles.iconContainer}>
          <Icon iconName={props.iconName} />
        </div>
      )}
      {!!props.children && (
        <div style={props.iconName ? styles.buttonContentWithIcon : undefined}>{props.children}</div>
      )}
    </MUButton>
  );

  function buildStyles(theme: Theme): { [cssClass: string]: CSSProperties } {
    return {
      button: {
        minWidth: theme.shape.borderRadius * 2,
        textTransform: 'none',
      },
      iconContainer: {
        display: 'flex',
      },
      buttonContentWithIcon: {
        paddingLeft: theme.spacing(),
      },
    };
  }
}
