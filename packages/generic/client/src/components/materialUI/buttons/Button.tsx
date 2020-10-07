import React, { ReactElement } from 'react';
import { Button as MUButton } from '@material-ui/core';

export { Button };

function Button(props: {
  color: 'primary' | 'secondary' | 'default';
  onClick: () => void;
  text: string;
}): ReactElement {
  return (
    <MUButton variant="contained" color={props.color}>
      {props.text}
    </MUButton>
  );
}
