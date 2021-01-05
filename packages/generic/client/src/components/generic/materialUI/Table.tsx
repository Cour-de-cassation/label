import React, { ReactNode } from 'react';
import { Table as MuiTable } from '@material-ui/core';

export { Table };

function Table(props: { isHeaderSticky?: boolean; children?: ReactNode }) {
  return <MuiTable stickyHeader={props.isHeaderSticky}>{props.children}</MuiTable>;
}
