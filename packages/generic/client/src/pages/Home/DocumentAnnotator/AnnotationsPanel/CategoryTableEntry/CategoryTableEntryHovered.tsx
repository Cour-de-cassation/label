import React from 'react';
import { annotationHandler, displayModeType, fetchedAnnotationType, settingsModule } from '@label/core';
import { ComponentsList, IconButton, LayoutGrid, LinkAnnotationDropdown, Text } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { customThemeType, emphasizeShadeColor, useCustomTheme, useDisplayMode } from '../../../../../styles';
import { clientAnonymizerType } from '../../../../../types';
import { wordings } from '../../../../../wordings';
import { entityEntryHandlerType } from '../useEntityEntryHandler';
import { splittedTextByLineType } from '../../lib';
import { buildCategoryTableEntryStyle } from './buildCategoryTableEntryStyle';
import { computeCategoryTableEntry } from './computeCategoryTableEntry';
import { UnlinkAnnotationDropdown } from './UnlinkAnnotationDropdown';

export { CategoryTableEntryHovered };

const CATEGORY_TABLE_ENTRY_BUTTON_SIZE = 32;

function CategoryTableEntryHovered(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
  entityAnnotations: fetchedAnnotationType[];
  entityId: string;
  entityEntryHandler: entityEntryHandlerType;
  hideActionButtons: () => void;
  selected?: boolean;
  splittedTextByLine: splittedTextByLineType;
}) {
  const { entityAnnotation, entityAnnotationTexts } = computeCategoryTableEntry({
    anonymizer: props.anonymizer,
    annotations: props.entityAnnotations,
  });
  const { displayMode } = useDisplayMode();
  const theme = useCustomTheme();
  const style = buildStyle(displayMode, theme, entityAnnotation.category);
  const annotatorState = props.annotatorStateHandler.get();

  return (
    <LayoutGrid
      container
      key={props.entityId}
      item
      justifyContent="space-between"
      onClick={selectEntity}
      onMouseLeave={props.hideActionButtons}
      style={style.categoryTableEntryHovered}
    >
      <LayoutGrid item style={style.textCell} xs={8}>
        {entityAnnotationTexts.map((text) => (
          <LayoutGrid item style={style.annotationTextContainer}>
            <Text variant="body2" style={{ ...style.annotationText, ...style.textWithAction }}>
              {text}
            </Text>
          </LayoutGrid>
        ))}
      </LayoutGrid>
      <LayoutGrid item style={style.actionCell} xs={4}>
        <ComponentsList
          components={[
            <LinkAnnotationDropdown
              annotatorStateHandler={props.annotatorStateHandler}
              annotation={entityAnnotation}
              buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
              onClose={props.hideActionButtons}
            />,
            <UnlinkAnnotationDropdown
              annotatorStateHandler={props.annotatorStateHandler}
              annotation={entityAnnotation}
              buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
              onClose={props.hideActionButtons}
            />,
            <IconButton
              buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
              color="secondary"
              hint={wordings.delete}
              iconName="delete"
              onClick={deleteAnnotations}
            />,
          ]}
          spaceBetweenComponents={theme.spacing}
        />
      </LayoutGrid>
    </LayoutGrid>
  );

  function buildStyle(displayMode: displayModeType, theme: customThemeType, category: string) {
    return {
      ...buildCategoryTableEntryStyle(theme),
      actionCell: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'flex-end',
        padding: `${theme.spacing / 2}px 0`,
      },
      categoryTableEntryHovered: {
        backgroundColor: props.selected
          ? emphasizeShadeColor(
              settingsModule.lib.getAnnotationCategoryColor(
                category,
                props.annotatorStateHandler.get().settings,
                displayMode,
              ),
              displayMode,
            )
          : theme.colors.default.hoveredBackground,
        borderRadius: theme.shape.borderRadius.medium,
        cursor: 'pointer',
        paddingLeft: `${theme.spacing * 2}px`,
      },
      textWithAction: {
        color: theme.colors.default.hoveredTextColor,
      },
    };
  }

  function selectEntity() {
    if (props.entityEntryHandler.getEntitySelected() === props.entityId) {
      props.entityEntryHandler.handleEntitySelection(undefined);
    } else {
      const entityLines = filterLineByEntityId(props.entityId, props.splittedTextByLine).map(({ line }) => line);
      props.entityEntryHandler.handleEntitySelection({ id: props.entityId, lineNumbers: entityLines });
    }
  }

  function filterLineByEntityId(entityId: string, splittedTextByLine: splittedTextByLineType): splittedTextByLineType {
    return splittedTextByLine.filter(({ content }) =>
      content.some((chunk) => {
        switch (chunk.type) {
          case 'annotation':
            return chunk.annotation.entityId === entityId;
          case 'text':
            return false;
        }
      }),
    );
  }

  function deleteAnnotations() {
    const newAnnotations = annotationHandler.deleteByEntityId(annotatorState.annotations, props.entityId);

    const newAnnotatorState = { ...annotatorState, annotations: newAnnotations };
    props.annotatorStateHandler.set(newAnnotatorState);

    props.hideActionButtons();
  }
}
