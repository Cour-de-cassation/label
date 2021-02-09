import React, { CSSProperties, ReactElement, MouseEvent } from 'react';
import { iconNameType, Icon, Text } from '../materialUI';
import { customThemeType, useCustomTheme } from '../../../styles';
import { Button, buttonColorType } from './Button';

export { ButtonWithIcon };

function ButtonWithIcon(props: {
  color?: buttonColorType;
  disabled?: boolean;
  iconName: iconNameType;
  onClick?: (event: MouseEvent) => void;
  style?: CSSProperties;
  text: string;
  type?: 'submit';
}): ReactElement {
  const theme = useCustomTheme();
  const style = buildStyle(theme);

  return (
    <Button
      color={props.color}
      disabled={props.disabled}
      onClick={props.onClick}
      style={{ ...style.button, ...props.style }}
      type={props.type}
    >
      <div style={style.iconContainer}>
        <Icon iconName={props.iconName} />
      </div>
      <Text style={style.buttonText}>{props.text}</Text>
    </Button>
  );

  function buildStyle(theme: customThemeType): { [cssClass: string]: CSSProperties } {
    return {
      button: {
        justifyContent: 'start',
        textTransform: 'none',
        padding: theme.spacing,
      },
      iconContainer: {
        display: 'flex',
      },
      buttonText: {
        paddingLeft: theme.spacing,
      },
    };
  }
}
