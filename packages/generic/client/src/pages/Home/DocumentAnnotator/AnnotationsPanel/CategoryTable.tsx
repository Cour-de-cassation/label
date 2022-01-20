import React, { useState } from 'react';
import styled from 'styled-components';
import { settingsModule } from '@label/core';
import { customThemeType, useCustomTheme, Accordion, Text, Icon } from 'pelta-design-system';
import { CategoryIcon } from '../../../../components';
import { useAnnotatorStateHandler } from '../../../../services/annotatorState';
import { annotationPerEntityType, splittedTextByLineType } from '../lib';
import { CategoryTableEntry } from './CategoryTableEntry';

export { CategoryTable };

const ACCORDION_HEADER_PADDING = 8;

const { Div_Body } = buildStyledComponents();

function CategoryTable(props: {
  category: string;
  categoryAnnotations: annotationPerEntityType;
  categorySize: number;
  splittedTextByLine: splittedTextByLineType;
}) {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const theme = useCustomTheme();
  const iconSize = theme.shape.borderRadius.l;
  const styles = buildStyles(theme);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const annotatorState = annotatorStateHandler.get();

  const categoryName = settingsModule.lib.getAnnotationCategoryText(props.category, annotatorState.settings);
  return (
    <Accordion
      headerStyle={styles.accordionHeaderContainer}
      header={
        <div style={styles.accordionHeader}>
          <div style={styles.accordionHeaderLeftContainer}>
            <CategoryIcon category={props.category} iconSize={iconSize} settings={annotatorState.settings} />
            <div style={styles.categoryContainer}>
              <Text>{`${categoryName} (${props.categorySize})`}</Text>
            </div>
          </div>
          <div style={styles.accordionHeaderArrowContainer}>
            <Icon iconName={isExpanded ? 'arrowUp' : 'arrowDown'} />
          </div>
        </div>
      }
      body={
        <Div_Body>
          {isExpanded &&
            props.categoryAnnotations.map(({ entityId, entityAnnotations }) => (
              <CategoryTableEntry
                entityAnnotations={entityAnnotations}
                entityId={entityId}
                key={entityId}
                splittedTextByLine={props.splittedTextByLine}
              />
            ))}
        </Div_Body>
      }
      onChange={setIsExpanded}
    />
  );

  function buildStyles(theme: customThemeType) {
    return {
      accordionHeaderContainer: {
        padding: ACCORDION_HEADER_PADDING,
        // Should be set in order to have a fixed header (Material UI dependent)
        minHeight: iconSize,
        '&$expanded': {
          minHeight: iconSize,
        },
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
      accordionHeaderArrowContainer: {
        paddingRight: theme.spacing,
        paddingTop: '4px',
      },
      categoryContainer: {
        paddingLeft: theme.spacing,
      },
    } as const;
  }
}

function buildStyledComponents() {
  const Div_Body = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
  `;

  return { Div_Body };
}
