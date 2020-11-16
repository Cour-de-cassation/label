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
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: CSSProperties;
  xs?: GridTypeMap['props']['xs'];
}): ReactElement {
  return (
    <MUGrid
      alignItems={props.alignItems}
      container={props.container}
      direction={props.direction}
      item={props.item}
      justify={props.justifyContent}
      onClick={props.onClick}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      style={props.style}
      xs={props.xs}
    >
      {props.children}
    </MUGrid>
  );
}
