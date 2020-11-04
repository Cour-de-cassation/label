import React, { ReactElement, MouseEvent } from 'react';
import { Theme, useTheme } from '@material-ui/core';
import { Button, iconNameType, Icon } from '../materialUI';

export { IconButton };

function IconButton(props: {
  color?: 'primary' | 'secondary' | 'default';
  disabled?: boolean;
  hint: string;
  iconName: iconNameType;
  onClick: (event: MouseEvent) => void;
}): ReactElement {
  const theme = useTheme();
  const style = buildStyle(theme);

  return (
    <Button
      color={props.color}
      disabled={props.disabled}
      hint={props.hint}
      onClick={props.onClick}
      style={style.button}
      variant="contained"
    >
      <div style={style.iconContainer}>
        <Icon iconName={props.iconName} />
      </div>
    </Button>
  );

  function buildStyle(theme: Theme) {
    return {
      button: {
        height: theme.shape.borderRadius * 2,
        width: theme.shape.borderRadius * 2,
        minWidth: theme.shape.borderRadius * 2,
      },
      iconContainer: {
        display: 'flex',
      },
    };
  }
}
