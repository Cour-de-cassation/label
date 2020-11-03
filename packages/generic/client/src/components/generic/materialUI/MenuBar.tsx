import React, { ReactNode } from 'react';
import { AppBar, PropTypes } from '@material-ui/core';

export { MenuBar };

function MenuBar(props: { children: ReactNode; color?: PropTypes.Color }) {
  return <AppBar color={props.color}>{props.children}</AppBar>;
}
