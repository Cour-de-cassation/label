import React, { CSSProperties, ReactElement, ReactNode } from 'react';
import { Grid as MUGrid, GridDirection, GridTypeMap } from '@material-ui/core';

export { LayoutGrid };

function LayoutGrid(props: {
  alignItems?: GridTypeMap['props']['alignItems'];
  children: ReactNode;
  container?: boolean;
  direction?: GridDirection;
  item?: boolean;
  justifyContent?: GridTypeMap['props']['justify'];
  style?: CSSProperties;
  xs?: GridTypeMap['props']['xs'];
}): ReactElement {
  return (
    <MUGrid
      style={props.style}
      container={props.container}
      alignItems={props.alignItems}
      justify={props.justifyContent}
      item={props.item}
      xs={props.xs}
      direction={props.direction}
    >
      {props.children}
    </MUGrid>
  );
}
