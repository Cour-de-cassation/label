import React from 'react';
import { settingsModule } from '@label/core';
import { LayoutGrid, Text } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { customThemeType, useCustomTheme } from '../../../../../styles';
import { clientAnonymizerType } from '../../../../../types';
import { entityEntryHandlerType } from '../useEntityEntryHandler';
import { buildCategoryTableEntryStyle } from './buildCategoryTableEntryStyle';
import { computeCategoryTableEntry } from './computeCategoryTableEntry';

export { CategoryTableEntrySelected };

function CategoryTableEntrySelected(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
  entityId: string;
  entityEntryHandler: entityEntryHandlerType;
  showActionButtons: () => void;
}) {
  const {
    entityAnnotation,
    entityAnnotationAnonymizedText,
    entityAnnotationTexts,
    numberOfEntities,
  } = computeCategoryTableEntry({
    annotatorStateHandler: props.annotatorStateHandler,
    anonymizer: props.anonymizer,
    entityId: props.entityId,
  });
  const theme = useCustomTheme();
  const style = buildStyle(theme, entityAnnotation.category);

  return (
    <LayoutGrid
      container
      key={props.entityId}
      item
      justifyContent="space-between"
      onMouseEnter={props.showActionButtons}
      style={style.categoryTableEntrySelected}
    >
      <LayoutGrid item style={style.textCell} xs={8}>
        {entityAnnotationTexts.map((text) => (
          <Text variant="body2">{text}</Text>
        ))}
      </LayoutGrid>
      <LayoutGrid item style={style.textCell} xs={3}>
        <Text style={style.anonymizedText} variant="body2">
          {entityAnnotationAnonymizedText}
        </Text>
      </LayoutGrid>
      <LayoutGrid item style={style.textCell} xs={1}>
        <Text style={style.occurencesNumber}>{numberOfEntities}</Text>
      </LayoutGrid>
    </LayoutGrid>
  );

  function buildStyle(theme: customThemeType, category: string) {
    return {
      ...buildCategoryTableEntryStyle(theme),
      categoryTableEntrySelected: {
        backgroundColor: settingsModule.lib.getAnnotationCategoryColor(
          category,
          props.annotatorStateHandler.get().settings,
        ),
        borderRadius: theme.shape.borderRadius,
        cursor: 'pointer',
        paddingLeft: `${theme.spacing * 2}px`,
      },
    };
  }
}
