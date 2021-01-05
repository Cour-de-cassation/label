import React, { ReactNode } from 'react';
import { TableRow as MuiTableRow } from '@material-ui/core';

export { TableRow };

function TableRow(props: { children?: ReactNode }) {
  return <MuiTableRow>{props.children}</MuiTableRow>;
}
