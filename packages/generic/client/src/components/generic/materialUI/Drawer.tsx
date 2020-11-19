import React, { ReactNode } from 'react';
import { Drawer as MuiDrawer, makeStyles } from '@material-ui/core';
import { zIndices } from './constants';
import { heights } from '../../../styles';

export { Drawer };

function Drawer(props: { children?: ReactNode; isOpen: boolean; onClose: () => void }) {
  const styles = buildStyles();
  const classes = buildClasses();

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

  function buildClasses() {
    return makeStyles({
      paper: {
        paddingTop: heights.header,
      },
    })();
  }
}
