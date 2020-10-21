import React, { CSSProperties, ReactElement, ReactNode } from 'react';
import { Grid as MUGrid, GridDirection, GridTypeMap } from '@material-ui/core';

export { LayoutGrid };

function LayoutGrid(props: {
  children: ReactNode;
  container?: boolean;
  item?: boolean;
  xs?: GridTypeMap['props']['xs'];
  justifyContent?: GridTypeMap['props']['justify'];
  alignItems?: GridTypeMap['props']['alignItems'];
  style?: CSSProperties;
  direction?: GridDirection;
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
