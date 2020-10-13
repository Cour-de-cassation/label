import { Typography } from '@material-ui/core';
import React, { ReactElement, ReactNode } from 'react';

export { Text };

function Text(props: {
  children: ReactNode;
  variant?: 'body1' | 'body2' | 'h1' | 'subtitle1';
  color?: 'textPrimary' | 'textSecondary';
}): ReactElement {
  return (
    <Typography color={props.color || 'textPrimary'} variant={props.variant}>
      {props.children}
    </Typography>
  );
}
