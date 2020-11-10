import React, { CSSProperties, ReactElement, ReactNode, MouseEvent } from 'react';
import { Button as MUButton, makeStyles, Tooltip } from '@material-ui/core';
import { customThemeType, useCustomTheme } from '../../../styles';
import { Text } from './Text';

export { Button };

function Button(props: {
  children?: ReactNode;
  color?: 'primary' | 'secondary' | 'default';
  disabled?: boolean;
  hint?: string;
  onClick: (event: MouseEvent) => void;
  style?: CSSProperties;
  variant: 'contained' | 'outlined';
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
        color={props.color}
        disabled={props.disabled}
        onClick={props.onClick}
        style={props.style}
        variant={props.variant}
      >
        {props.children}
      </MUButton>
    );
  }

  function buildButtonClasses(theme: customThemeType) {
    return makeStyles({
      root: {
        margin: 0,
        '&:hover': {
          backgroundColor: theme.colors.button.default.hoveredBackground,
        },
      },
    })();
  }
}
