import React from 'react';
import { displayModeType, fetchedAnnotationType, fetchedAnnotationHandler, settingsModule } from '@label/core';
import {
  ComponentsList,
  IconButton,
  LayoutGrid,
  LinkAnnotationDropdown,
  Text,
  UnlinkAnnotationButton,
} from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { customThemeType, emphasizeShadeColor, useCustomTheme, useDisplayMode } from '../../../../../styles';
import { clientAnonymizerType } from '../../../../../types';
import { wordings } from '../../../../../wordings';
import { entityEntryHandlerType } from '../useEntityEntryHandler';
import { buildCategoryTableEntryStyle } from './buildCategoryTableEntryStyle';
import { computeCategoryTableEntry } from './computeCategoryTableEntry';

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
              disabled={false}
              onClose={props.hideActionButtons}
            />,
            <UnlinkAnnotationButton
              annotatorStateHandler={props.annotatorStateHandler}
              annotation={entityAnnotation}
              buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
              disabled={false}
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
      props.entityEntryHandler.handleEntitySelection(props.entityId);
    }
  }

  function deleteAnnotations() {
    const newAnnotations = fetchedAnnotationHandler.deleteByEntityId(annotatorState.annotations, props.entityId);

    const newAnnotatorState = { ...annotatorState, annotations: newAnnotations };
    props.annotatorStateHandler.set(newAnnotatorState);

    props.hideActionButtons();
  }
}
