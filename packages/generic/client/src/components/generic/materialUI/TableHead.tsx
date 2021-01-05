import React, { ReactNode } from 'react';
import { TableHead as MuiTableHead } from '@material-ui/core';

export { TableHead };

function TableHead(props: { children?: ReactNode }) {
  return <MuiTableHead>{props.children}</MuiTableHead>;
}
