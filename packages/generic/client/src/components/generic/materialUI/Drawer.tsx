import React, { ReactNode } from 'react';
import { Drawer as MuiDrawer, makeStyles } from '@material-ui/core';
import { zIndices } from './constants';
import { customThemeType, heights, useCustomTheme } from '../../../styles';

export { Drawer };

function Drawer(props: { children?: ReactNode; isOpen: boolean; onClose: () => void }) {
  const theme = useCustomTheme();
  const styles = buildStyles();
  const classes = buildClasses(theme);

  return (
    <MuiDrawer style={styles.drawer} classes={classes} anchor="right" open={props.isOpen} onClose={props.onClose}>
      {props.children}
    </MuiDrawer>
  );

  function buildStyles() {
    return {
      drawer: {
        zIndex: zIndices.drawer,
      },
    };
  }

  function buildClasses(theme: customThemeType) {
    return makeStyles({
      paper: {
        boxShadow: theme.boxShadow.minor,
        paddingTop: heights.header,
      },
    })();
  }
}
