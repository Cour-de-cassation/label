import React, { ReactNode } from 'react';
import { TableSortLabel as MuiTableSortLabel } from '@material-ui/core';
export { TableSortLabel };

function TableSortLabel(props: {
  active: boolean;
  children: ReactNode;
  direction: 'asc' | 'desc';
  onClick: () => void;
}) {
  return (
    <MuiTableSortLabel active={props.active} direction={props.direction} onClick={props.onClick}>
      {props.children}
    </MuiTableSortLabel>
  );
}
