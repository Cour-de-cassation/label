import React, { useState } from 'react';
import styled from 'styled-components';
import { settingsModule } from '@label/core';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { LayoutGrid, Accordion, Text, Icon, CategoryIcon } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { clientAnonymizerType } from '../../../../types';
import { annotationPerEntityType, splittedTextByLineType } from '../lib';
import { CategoryTableEntry } from './CategoryTableEntry';
import { entityEntryHandlerType } from './useEntityEntryHandler';

export { CategoryTable };

const ACCORDION_HEADER_PADDING = 5;

const { Div_Body } = buildStyledComponents();

function CategoryTable(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
  category: string;
  categoryAnnotations: annotationPerEntityType;
  categorySize: number;
  entityEntryHandler: entityEntryHandlerType;
  splittedTextByLine: splittedTextByLineType;
}) {
  const theme = useCustomTheme();
  const iconSize = theme.shape.borderRadius.medium * 2 - ACCORDION_HEADER_PADDING;
  const styles = buildStyles(theme);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const annotatorState = props.annotatorStateHandler.get();

  const categoryName = settingsModule.lib.getAnnotationCategoryText(props.category, annotatorState.settings);

  return (
    <Accordion
      headerStyle={styles.accordionHeader}
      header={
        <LayoutGrid container>
          <LayoutGrid container item alignItems="center" xs={11}>
            <LayoutGrid item>
              <CategoryIcon category={props.category} iconSize={iconSize} settings={annotatorState.settings} />
            </LayoutGrid>
            <LayoutGrid item style={styles.categoryContainer}>
              <Text>{`${categoryName} (${props.categorySize})`}</Text>
            </LayoutGrid>
          </LayoutGrid>
          <LayoutGrid container item alignItems="center" xs={1}>
            <Icon iconName={isExpanded ? 'arrowReduce' : 'arrowExpand'} />
          </LayoutGrid>
        </LayoutGrid>
      }
      body={
        <Div_Body>
          {props.categoryAnnotations.map(({ entityId, entityAnnotations }) => (
            <CategoryTableEntry
              annotatorStateHandler={props.annotatorStateHandler}
              entityAnnotations={entityAnnotations}
              entityId={entityId}
              entityEntryHandler={props.entityEntryHandler}
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
      accordionHeader: {
        padding: ACCORDION_HEADER_PADDING,
        // Should be set in order to have a fixed header (Material UI dependent)
        minHeight: iconSize,
        '&$expanded': {
          minHeight: iconSize,
        },
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
