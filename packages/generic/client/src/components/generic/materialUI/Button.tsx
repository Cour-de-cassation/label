import React, { CSSProperties, ReactElement, ReactNode, MouseEvent } from 'react';
import { Button as MUButton } from '@material-ui/core';

export { Button };

function Button(props: {
  children?: ReactNode;
  color?: 'primary' | 'secondary' | 'default';
  disabled?: boolean;
  onClick: (event: MouseEvent) => void;
  style?: CSSProperties;
  variant: 'contained' | 'outlined';
}): ReactElement {
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
