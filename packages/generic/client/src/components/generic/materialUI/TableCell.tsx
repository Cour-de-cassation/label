import React, { ReactNode } from 'react';
import { TableCell as MuiTableCell } from '@material-ui/core';

export { TableCell };

function TableCell(props: { children?: ReactNode; classes: { root: string } }) {
  return <MuiTableCell classes={props.classes}>{props.children}</MuiTableCell>;
}
