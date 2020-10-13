import React, { CSSProperties, ReactElement, ReactNode, MouseEvent } from 'react';
import { Button as MUButton } from '@material-ui/core';

export { Button };

function Button(props: {
  children: ReactNode;
  color?: 'primary' | 'secondary' | 'default';
  onClick: (event: MouseEvent) => void;
  style?: CSSProperties;
}): ReactElement {
  return (
    <MUButton variant="contained" color={props.color} onClick={props.onClick} style={props.style}>
      {props.children}
    </MUButton>
  );
}
