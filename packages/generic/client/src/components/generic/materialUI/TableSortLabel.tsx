import React, { ReactNode } from 'react';
import { TableSortLabel as MuiTableSortLabel } from '@material-ui/core';
import { orderDirectionType } from '../custom';
export { TableSortLabel };

function TableSortLabel(props: {
  active: boolean;
  children: ReactNode;
  direction: orderDirectionType;
  onClick: () => void;
}) {
  return (
    <MuiTableSortLabel active={props.active} direction={props.direction} onClick={props.onClick}>
      {props.children}
    </MuiTableSortLabel>
  );
}
