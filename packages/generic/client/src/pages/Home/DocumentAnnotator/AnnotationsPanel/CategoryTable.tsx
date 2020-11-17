import React, { useState } from 'react';
import { fetchedAnnotationType, settingsModule } from '@label/core';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { LayoutGrid, Accordion, Text, Icon, CategoryIcon } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { clientAnonymizerType } from '../../../../types';
import { CategoryTableEntry } from './CategoryTableEntry';
import { entityEntryHandlerType } from './useEntityEntryHandler';

export { CategoryTable };

const ACCORDION_HEADER_PADDING = 5;

function CategoryTable(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
  category: string;
  categoryAnnotations: Array<{ entityId: string; entityAnnotations: fetchedAnnotationType[] }>;
  categorySize: number;
  entityEntryHandler: entityEntryHandlerType;
}) {
  const theme = useCustomTheme();
  const iconSize = theme.shape.borderRadius * 2 - ACCORDION_HEADER_PADDING;
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
              <CategoryIcon
                annotatorStateHandler={props.annotatorStateHandler}
                category={props.category}
                iconSize={iconSize}
              />
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
        <LayoutGrid container>
          {props.categoryAnnotations.map(({ entityId, entityAnnotations }) => (
            <CategoryTableEntry
              annotatorStateHandler={props.annotatorStateHandler}
              anonymizer={props.anonymizer}
              entityAnnotations={entityAnnotations}
              entityId={entityId}
              entityEntryHandler={props.entityEntryHandler}
            />
          ))}
        </LayoutGrid>
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
