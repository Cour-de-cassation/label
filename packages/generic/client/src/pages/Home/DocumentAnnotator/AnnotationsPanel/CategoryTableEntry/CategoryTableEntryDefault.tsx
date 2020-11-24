import React from 'react';
import { fetchedAnnotationType } from '@label/core';
import { LayoutGrid, Text } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { customThemeType, useCustomTheme } from '../../../../../styles';
import { clientAnonymizerType } from '../../../../../types';
import { buildCategoryTableEntryStyle } from './buildCategoryTableEntryStyle';
import { computeCategoryTableEntry } from './computeCategoryTableEntry';

export { CategoryTableEntryDefault };

function CategoryTableEntryDefault(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
  entityAnnotations: fetchedAnnotationType[];
  entityId: string;
  showActionButtons: () => void;
}) {
  const theme = useCustomTheme();
  const style = buildStyle(theme);

  const { entityAnnotationAnonymizedText, entityAnnotationTexts, numberOfEntities } = computeCategoryTableEntry({
    annotations: props.entityAnnotations,
    anonymizer: props.anonymizer,
  });

  return (
    <LayoutGrid
      container
      key={props.entityId}
      item
      justifyContent="space-between"
      onMouseEnter={props.showActionButtons}
      style={style.categoryTableEntryDefault}
    >
      <LayoutGrid item style={style.textCell} xs={8}>
        {entityAnnotationTexts.map((text) => (
          <LayoutGrid item style={style.annotationTextContainer}>
            <Text variant="body2" style={style.annotationText}>
              {text}
            </Text>
          </LayoutGrid>
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

  function buildStyle(theme: customThemeType) {
    return {
      ...buildCategoryTableEntryStyle(theme),
      categoryTableEntryDefault: {
        borderRadius: theme.shape.borderRadius.medium,
        paddingLeft: `${theme.spacing * 2}px`,
      },
    };
  }
}
