import React, { ReactElement, ReactNodeArray } from 'react';
import { Accordion as MuiAccordion } from '@material-ui/core';

export { Accordion };

function Accordion(props: { children: ReactNodeArray }): ReactElement {
  return <MuiAccordion>{props.children}</MuiAccordion>;
}
