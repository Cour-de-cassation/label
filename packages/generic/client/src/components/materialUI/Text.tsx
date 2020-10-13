import { Typography } from '@material-ui/core';
import React, { ReactElement, ReactNode } from 'react';
import { typographyType } from '../../styles';

export { Text };

function Text(props: {
  children: ReactNode;
  variant?: typographyType;
  color?: 'textPrimary' | 'textSecondary';
}): ReactElement {
  return (
    <Typography color={props.color || 'textPrimary'} variant={props.variant}>
      {props.children}
    </Typography>
  );
}
