import React, { CSSProperties, ReactElement, MouseEvent } from 'react';
import { Theme, useTheme } from '@material-ui/core';
import { Button, iconNameType, Icon } from '../materialUI';

export { ButtonWithIcon };

function ButtonWithIcon(props: {
  color?: 'primary' | 'secondary' | 'default';
  disabled?: boolean;
  iconName: iconNameType;
  onClick: (event: MouseEvent) => void;
  style?: CSSProperties;
  text: string;
}): ReactElement {
  const theme = useTheme();
  const style = buildStyle(theme);

  return (
    <Button
      color={props.color}
      disabled={props.disabled}
      onClick={props.onClick}
      style={{ ...style.button, ...props.style }}
      variant="contained"
    >
      <div style={style.iconContainer}>
        <Icon iconName={props.iconName} />
      </div>
      <div style={style.buttonText}>{props.text}</div>
    </Button>
  );

  function buildStyle(theme: Theme): { [cssClass: string]: CSSProperties } {
    return {
      button: {
        justifyContent: 'start',
        textTransform: 'none',
      },
      iconContainer: {
        display: 'flex',
      },
      buttonText: {
        paddingLeft: theme.spacing(),
      },
    };
  }
}
