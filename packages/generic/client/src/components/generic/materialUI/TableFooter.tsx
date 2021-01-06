import React, { ReactNode } from 'react';
import { makeStyles, TableFooter as MuiTableFooter } from '@material-ui/core';
import { useCustomTheme } from '../../../styles';

export { TableFooter };

function TableFooter(props: { children?: ReactNode; isSticky?: boolean }) {
  const theme = useCustomTheme();
  const classes = props.isSticky ? buildStickyClasses() : undefined;
  return <MuiTableFooter classes={classes}>{props.children}</MuiTableFooter>;

  function buildStickyClasses() {
    return makeStyles({
      root: {
        backgroundColor: theme.colors.background,
        bottom: 0,
        position: 'sticky',
      },
    })();
  }
}
