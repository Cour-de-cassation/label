import React, { CSSProperties, ReactElement, ReactNode } from 'react';
import { AccordionSummary, makeStyles } from '@material-ui/core';

export { AccordionHeader };

const useStyles = makeStyles({
  content: {
    margin: 0,
  },
});

function AccordionHeader(props: { children: ReactNode; style?: CSSProperties }): ReactElement {
  const classes = useStyles();
  return (
    <AccordionSummary classes={{ content: classes.content }} style={props.style}>
      {props.children}
    </AccordionSummary>
  );
}
