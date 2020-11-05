import React, { ReactNode } from 'react';
import { AppBar, PropTypes } from '@material-ui/core';
import { zIndices } from './constants';

export { MenuBar };

function MenuBar(props: { children: ReactNode; color?: PropTypes.Color }) {
  const styles = buildStyles();
  return (
    <AppBar position="relative" style={styles.appBar} color={props.color}>
      {props.children}
    </AppBar>
  );

  function buildStyles() {
    return {
      appBar: {
        zIndex: zIndices.menuBar,
      },
    };
  }
}
