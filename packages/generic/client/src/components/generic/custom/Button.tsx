import React, { CSSProperties, ReactElement, ReactNode, MouseEvent, useState } from 'react';
import { Tooltip } from '@material-ui/core';

import { customThemeType, useCustomTheme } from '../../../styles';
import { Text } from '../materialUI/Text';

export { Button };

export type { buttonColorType };

type buttonColorType = 'primary' | 'warning' | 'alert' | 'default';

function Button(props: {
  children?: ReactNode;
  color?: buttonColorType;
  disabled?: boolean;
  disabledHover?: boolean;
  hint?: string;
  onClick?: (event: MouseEvent) => void;
  style?: CSSProperties;
  type?: 'submit';
}): ReactElement {
  const theme = useCustomTheme();
  const [isHovered, setIsHovered] = useState(false);
  const buttonStyles = buildButtonStyles(theme);
  const style = { ...buttonStyles, ...props.style };
  return props.hint && !props.disabled ? (
    <Tooltip arrow title={<Text>{props.hint}</Text>}>
      {buildButton()}
    </Tooltip>
  ) : (
    buildButton()
  );

  function buildButton() {
    if (props.disabledHover || props.disabled) {
      return (
        <div onClick={onClick} style={style}>
          {props.children}
        </div>
      );
    }

    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={style}
        type={props.type}
      >
        {props.children}
      </button>
    );
  }

  function buildButtonStyles(theme: customThemeType) {
    const color = props.color || 'default';
    const opacity = props.disabled ? 0.2 : 1;
    const cursor = props.disabled ? 'default' : 'pointer';
    const hoveredStyles = isHovered
      ? { backgroundColor: theme.colors[color].hoveredBackground, color: theme.colors[color].hoveredTextColor }
      : undefined;
    return {
      borderRadius: theme.shape.borderRadius.m,
      backgroundColor: theme.colors[color].background,
      margin: 0,
      cursor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity,
      border: 'none',
      color: 'inherit',
      ...hoveredStyles,
    };
  }

  function onClick(event: MouseEvent) {
    event.stopPropagation();
    !props.disabled && props.onClick && props.onClick(event);
  }
}
