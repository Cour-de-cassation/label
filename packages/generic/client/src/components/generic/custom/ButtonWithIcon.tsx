import React, { CSSProperties, ReactElement, MouseEvent } from 'react';
import { Button, iconNameType, Icon, buttonColorType } from '../materialUI';
import { customThemeType, useCustomTheme } from '../../../styles';

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
      variant="contained"
    >
      <div style={style.iconContainer}>
        <Icon iconName={props.iconName} />
      </div>
      <div style={style.buttonText}>{props.text}</div>
    </Button>
  );

  function buildStyle(theme: customThemeType): { [cssClass: string]: CSSProperties } {
    return {
      button: {
        justifyContent: 'start',
        textTransform: 'none',
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
