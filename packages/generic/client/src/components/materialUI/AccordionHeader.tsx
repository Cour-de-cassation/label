import React, { ReactElement, ReactNode } from 'react';
import { AccordionSummary } from '@material-ui/core';

export { AccordionHeader };

function AccordionHeader(props: { children: ReactNode }): ReactElement {
  return <AccordionSummary>{props.children}</AccordionSummary>;
}
