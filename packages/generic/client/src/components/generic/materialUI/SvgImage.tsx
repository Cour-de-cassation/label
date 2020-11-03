import React, { ReactNode, CSSProperties } from 'react';
import { SvgIcon } from '@material-ui/core';

export { SvgImage };

function SvgImage(props: { children: ReactNode; style: CSSProperties }) {
  return <SvgIcon style={props.style}>{props.children}</SvgIcon>;
}
