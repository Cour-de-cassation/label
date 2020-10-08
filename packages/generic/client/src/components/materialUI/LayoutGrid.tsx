import React, { ReactElement, ReactNode } from 'react';
import { Grid as MUGrid, GridTypeMap } from '@material-ui/core';

export { LayoutGrid };

function LayoutGrid(props: {
  children: ReactNode;
  container?: boolean;
  item?: boolean;
  xs?: GridTypeMap['props']['xs'];
  justifyContent?: GridTypeMap['props']['justify'];
  alignItems?: GridTypeMap['props']['alignItems'];
}): ReactElement {
  return (
    <MUGrid
      container={props.container}
      alignItems={props.alignItems}
      justify={props.justifyContent}
      item={props.item}
      xs={props.xs}
    >
      {props.children}
    </MUGrid>
  );
}
