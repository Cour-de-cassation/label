import React, { ReactNode } from 'react';
import { TableBody as MuiTableBody } from '@material-ui/core';

export { TableBody };

function TableBody(props: { children?: ReactNode }) {
  return <MuiTableBody>{props.children}</MuiTableBody>;
}
