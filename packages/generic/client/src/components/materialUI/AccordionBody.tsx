import React, { ReactElement, ReactNode } from 'react';
import { AccordionDetails } from '@material-ui/core';

export { AccordionBody };

function AccordionBody(props: { children: ReactNode }): ReactElement {
  return <AccordionDetails>{props.children}</AccordionDetails>;
}
