import React, { CSSProperties, ReactElement, ReactNode, MouseEvent } from 'react';
import { Button as MUButton, Tooltip } from '@material-ui/core';
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
  return props.hint ? (
    <Tooltip arrow title={<Text>{props.hint}</Text>}>
      {buildButton()}
    </Tooltip>
  ) : (
    buildButton()
  );

  function buildButton() {
    return (
      <MUButton
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
}
