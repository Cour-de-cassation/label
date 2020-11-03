import { Typography } from '@material-ui/core';
import React, { ReactElement, ReactNode, CSSProperties } from 'react';
import { typographyType } from '../../../styles';

export { Text };

function Text(props: {
  children: ReactNode;
  variant?: typographyType;
  color?: 'textPrimary' | 'textSecondary';
  style?: CSSProperties;
}): ReactElement {
  return (
    <Typography color={props.color || 'textPrimary'} style={props.style} variant={props.variant}>
      {props.children}
    </Typography>
  );
}
