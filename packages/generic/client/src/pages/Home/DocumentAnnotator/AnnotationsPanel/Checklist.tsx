import React, { useState } from 'react';
import { Accordion, customThemeType, Icon, Text, useCustomTheme } from 'pelta-design-system';
import { wordings } from '../../../../wordings';
import { ChecklistEntry } from './ChecklistEntry';
import { splittedTextByLineType } from '../lib';
import { useAnnotatorStateHandler } from '../../../../services/annotatorState';
import { documentType } from '@label/core';

export { Checklist };

const ACCORDION_HEADER_PADDING = 8;

function Checklist(props: { checklist: documentType['checklist']; splittedTextByLine: splittedTextByLineType }) {
  const theme = useCustomTheme();
  const iconSize = theme.shape.borderRadius.l;
  const styles = buildStyles(theme);
  const annotatorStateHandler = useAnnotatorStateHandler();
  const settings = annotatorStateHandler.get().settings;

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <Accordion
      style={styles.accordionStyle}
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
        <div style={styles.accordionContent}>
          {props.checklist &&
            props.checklist.map((item, index) => (
              <div key={index}>
                <ChecklistEntry check={item} splittedTextByLine={props.splittedTextByLine} settings={settings} />
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
      accordionStyle: {
        backgroundColor: theme.colors.checklist,
      },
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
      accordionContent: {
        width: '100%',
      },
    } as const;
  }
}
