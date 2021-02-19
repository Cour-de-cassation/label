import React, { ReactElement, MouseEvent } from 'react';
import { customThemeType, useCustomTheme } from '../../../styles';
import { iconNameType, Icon } from '../materialUI';
import { Button, buttonColorType } from './Button';

export { IconButton };

const ICON_BUTTON_SIZE = 40;

function IconButton(props: {
  buttonSize?: number;
  backgroundColor?: buttonColorType;
  color?: buttonColorType;
  disabled?: boolean;
  hint: string;
  iconName: iconNameType;
  onClick: (event: MouseEvent) => void;
}): ReactElement {
  const theme = useCustomTheme();
  const style = buildStyle(theme);

  return (
    <Button
      color={props.backgroundColor}
      disabled={props.disabled}
      hint={props.hint}
      onClick={props.onClick}
      style={style.button}
    >
      <div style={style.iconContainer}>
        <Icon iconName={props.iconName} style={style.icon} />
      </div>
    </Button>
  );

  function buildStyle(theme: customThemeType) {
    const buttonSize = props.buttonSize || ICON_BUTTON_SIZE;
    const color = props.color ? theme.colors[props.color].background : undefined;

    return {
      button: {
        width: buttonSize,
        minWidth: buttonSize,
        height: buttonSize,
        borderRadius: buttonSize / 2,
      },
      iconContainer: {
        display: 'flex',
      },
      icon: {
        color,
      },
    };
  }
}
