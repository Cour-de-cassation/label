import React, { CSSProperties, ReactElement, ReactNodeArray } from 'react';
import { Accordion as MuiAccordion } from '@material-ui/core';

export { Accordion };

function Accordion(props: { children: ReactNodeArray; style?: CSSProperties }): ReactElement {
  return <MuiAccordion style={props.style}>{props.children}</MuiAccordion>;
}
