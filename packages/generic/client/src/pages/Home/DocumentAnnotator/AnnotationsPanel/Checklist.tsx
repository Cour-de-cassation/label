import React, { useState } from 'react';
import { annotationReportType } from '@label/core';
import { Accordion, customThemeType, Icon, Text, useCustomTheme } from 'pelta-design-system';
import { wordings } from '../../../../wordings';
import { ChecklistEntry } from './ChecklistEntry';
import { splittedTextByLineType } from '../lib';

export { Checklist };

const ACCORDION_HEADER_PADDING = 8;

function Checklist(props: {
  checklist: annotationReportType['checklist'];
  splittedTextByLine: splittedTextByLineType;
}) {
  const theme = useCustomTheme();
  const iconSize = theme.shape.borderRadius.l;
  const styles = buildStyles(theme);

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <Accordion
      headerStyle={styles.accordionHeaderContainer}
      header={
        <div style={styles.accordionHeader}>
          <div style={styles.accordionHeaderLeftContainer}>
            <Icon iconName={'help'} />
            <div style={styles.categoryContainer}>
              <Text>{`${wordings.homePage.checklist}`}</Text>
            </div>
          </div>
          <div style={styles.accordionHeaderArrowContainer}>
            <Icon iconName={isExpanded ? 'arrowUp' : 'arrowDown'} />
          </div>
        </div>
      }
      body={
        <div>
          {props.checklist.map((item, index) => (
            <div key={index}>
              <ChecklistEntry check={item} splittedTextByLine={props.splittedTextByLine} />
            </div>
          ))}
        </div>
      }
      onChange={setIsExpanded}
      defaultExpanded={true}
    />
  );

  function buildStyles(theme: customThemeType) {
    return {
      accordionHeaderContainer: {
        padding: ACCORDION_HEADER_PADDING,
        minHeight: iconSize,
      },
      accordionHeader: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      accordionHeaderLeftContainer: {
        display: 'flex',
        alignItems: 'center',
      },
      categoryContainer: {
        paddingLeft: theme.spacing,
      },
      accordionHeaderArrowContainer: {
        paddingRight: theme.spacing,
        paddingTop: '4px',
      },
    } as const;
  }
}
