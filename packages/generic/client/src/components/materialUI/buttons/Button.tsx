import React, { CSSProperties, ReactElement, ReactNode } from 'react';
import { Button as MUButton } from '@material-ui/core';

export { Button };

function Button(props: {
  children: ReactNode;
  color?: 'primary' | 'secondary' | 'default';
  onClick: () => void;
  style?: CSSProperties;
}): ReactElement {
  return (
    <MUButton variant="contained" color={props.color} style={props.style}>
      {props.children}
    </MUButton>
  );
}
