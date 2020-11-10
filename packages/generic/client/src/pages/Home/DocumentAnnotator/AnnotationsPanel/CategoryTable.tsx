import React, { useState } from 'react';
import { uniq } from 'lodash';
import { anonymizerType, fetchedAnnotationType, settingsModule } from '@label/core';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { LayoutGrid, Accordion, Text, Icon, CategoryIcon } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { CategoryTableEntry } from './CategoryTableEntry';

export { CategoryTable };

const ACCORDION_HEADER_PADDING = 5;

function CategoryTable(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
  category: string;
}) {
  const theme = useCustomTheme();
  const iconSize = theme.shape.borderRadius * 2 - ACCORDION_HEADER_PADDING;
  const styles = buildStyles(theme);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [entryFocused, setEntryFocused] = useState<string | undefined>(undefined);
  const annotatorState = props.annotatorStateHandler.get();

  const categoryName = settingsModule.lib.getAnnotationCategoryText(props.category, annotatorState.settings);
  const categoryAnnotations = annotatorState.annotations.filter((annotation) => annotation.category === props.category);
  const categoryAnnotationEntityIds = computeSortedEntityIds(categoryAnnotations);

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
              <Text>{`${categoryName} (${categoryAnnotations.length})`}</Text>
            </LayoutGrid>
          </LayoutGrid>
          <LayoutGrid container item alignItems="center" xs={1}>
            <Icon iconName={isExpanded ? 'arrowReduce' : 'arrowExpand'} />
          </LayoutGrid>
        </LayoutGrid>
      }
      body={
        <LayoutGrid container>
          {Object.values(categoryAnnotationEntityIds).map((entityId) => (
            <CategoryTableEntry
              annotatorStateHandler={props.annotatorStateHandler}
              anonymizer={props.anonymizer}
              entityId={entityId}
              setShouldShowActionButtons={buildSetShouldShowActionButtons(entityId)}
              shouldShowActionButtons={entryFocused === entityId}
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

  function computeSortedEntityIds(annotations: fetchedAnnotationType[]) {
    return uniq(annotations.map((annotation) => annotation.entityId)).sort(
      (entityId1, entityId2) =>
        annotations.filter((annotation) => annotation.entityId === entityId2).length -
        annotations.filter((annotation) => annotation.entityId === entityId1).length,
    );
  }

  function buildSetShouldShowActionButtons(entityId: string) {
    return (isHovered: boolean) => (isHovered ? setEntryFocused(entityId) : setEntryFocused(undefined));
  }
}
