import React, { CSSProperties, ReactElement, ReactNode, MouseEvent } from 'react';
import { Button as MUButton, makeStyles, Tooltip } from '@material-ui/core';
import { customThemeType, useCustomTheme } from '../../../styles';
import { Text } from './Text';

export { Button };

export type { buttonColorType };

type buttonColorType = 'primary' | 'secondary' | 'alert' | 'default';

function Button(props: {
  children?: ReactNode;
  color?: buttonColorType;
  disabled?: boolean;
  disabledHover?: boolean;
  hint?: string;
  onClick?: (event: MouseEvent) => void;
  style?: CSSProperties;
  type?: 'submit';
  variant: 'contained' | 'outlined';
  width?: string;
}): ReactElement {
  const theme = useCustomTheme();
  const classes = buildButtonClasses(theme);
  return props.hint ? (
    <Tooltip arrow title={<Text>{props.hint}</Text>}>
      <div>{buildButton()}</div>
    </Tooltip>
  ) : (
    buildButton()
  );

  function buildButton() {
    return (
      <MUButton
        classes={{ root: classes.root }}
        disabled={props.disabled}
        onClick={onClick}
        style={props.style}
        variant={props.variant}
        type={props.type}
      >
        {props.children}
      </MUButton>
    );
  }

  function buildButtonClasses(theme: customThemeType) {
    const color = props.color || 'default';

    return makeStyles({
      root: {
        borderRadius: theme.shape.borderRadius.medium,
        width: props.width,
        backgroundColor: theme.colors[color].background,
        margin: 0,
        '&:hover': props.disabledHover
          ? {}
          : {
              backgroundColor: theme.colors[color].hoveredBackground,
              color: theme.colors[color].hoveredTextColor,
            },
      },
    })();
  }

  function onClick(event: MouseEvent) {
    event.stopPropagation();
    props.onClick && props.onClick(event);
  }
}
