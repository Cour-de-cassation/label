import React, { CSSProperties, ReactElement } from 'react';
import { Accordion as MuiAccordion, AccordionDetails, AccordionSummary, makeStyles } from '@material-ui/core';
import { customThemeType, useCustomTheme } from '../../../styles';

export { Accordion };

function Accordion(props: {
  headerStyle?: CSSProperties;
  header: ReactElement;
  body: ReactElement;
  onChange: (expanded: boolean) => void;
  style?: CSSProperties;
}): ReactElement {
  const theme = useCustomTheme();
  const accordionClasses = buildAccordionClasses(theme);
  const accordionHeaderClasses = buildAccordionHeaderClasses();

  return (
    <MuiAccordion
      classes={accordionClasses}
      onChange={(_event, expanded) => props.onChange(expanded)}
      style={props.style}
    >
      <AccordionSummary
        classes={{
          content: accordionHeaderClasses.content,
          expanded: accordionHeaderClasses.expanded,
        }}
        style={props.headerStyle}
      >
        {props.header}
      </AccordionSummary>
      <AccordionDetails>{props.body}</AccordionDetails>
    </MuiAccordion>
  );
}

function buildAccordionClasses(theme: customThemeType) {
  return makeStyles({
    rounded: {
      borderRadius: theme.shape.borderRadius.medium,
      '&:first-child': {
        borderRadius: theme.shape.borderRadius.medium,
      },
      '&:last-child': {
        borderRadius: theme.shape.borderRadius.medium,
      },
    },
  })();
}

function buildAccordionHeaderClasses() {
  return makeStyles({
    content: {
      margin: 0,
      '&$expanded': {
        margin: '0',
      },
    },
    expanded: {},
  })();
}
