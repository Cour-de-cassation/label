import React, { ReactElement, ReactNode } from 'react';
import { Grid as MUGrid } from '@material-ui/core';

export { LayoutGrid };

function LayoutGrid(props: {
  children: ReactNode;
  container?: boolean;
  item?: boolean;
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
}): ReactElement {
  return (
    <MUGrid container={props.container} justify={props.justifyContent} item={props.item}>
      {props.children}
    </MUGrid>
  );
}
