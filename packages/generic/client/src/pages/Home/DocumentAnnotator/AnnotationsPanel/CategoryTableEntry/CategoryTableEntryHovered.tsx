import React from 'react';
import {
  ComponentsList,
  DeleteAnnotationButton,
  LayoutGrid,
  LinkAnnotationDropdown,
  Text,
  UnlinkAnnotationButton,
} from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { customThemeType, useCustomTheme } from '../../../../../styles';
import { clientAnonymizerType } from '../../../../../types';
import { entityEntryHandlerType } from '../useEntityEntryHandler';
import { buildCategoryTableEntryStyle } from './buildCategoryTableEntryStyle';
import { computeCategoryTableEntry } from './computeCategoryTableEntry';

export { CategoryTableEntryHovered };

const CATEGORY_TABLE_ENTRY_BUTTON_SIZE = 32;

function CategoryTableEntryHovered(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
  entityId: string;
  entityEntryHandler: entityEntryHandlerType;
  hideActionButtons: () => void;
}) {
  const theme = useCustomTheme();
  const style = buildStyle(theme);

  const { entityAnnotation, entityAnnotationTexts } = computeCategoryTableEntry({
    annotatorStateHandler: props.annotatorStateHandler,
    anonymizer: props.anonymizer,
    entityId: props.entityId,
  });

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
          <Text style={style.textWithAction} variant="body2">
            {text}
          </Text>
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
            <DeleteAnnotationButton
              annotatorStateHandler={props.annotatorStateHandler}
              annotation={entityAnnotation}
              buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onClick={() => {}}
              shouldApplyEverywhere={true}
            />,
          ]}
          spaceBetweenComponents={theme.spacing}
        />
      </LayoutGrid>
    </LayoutGrid>
  );

  function buildStyle(theme: customThemeType) {
    return {
      ...buildCategoryTableEntryStyle(theme),
      actionCell: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'flex-end',
        padding: `${theme.spacing / 2}px 0`,
      },
      categoryTableEntryHovered: {
        backgroundColor: theme.colors.button.default.hoveredBackground,
        borderRadius: theme.shape.borderRadius,
        cursor: 'pointer',
        paddingLeft: `${theme.spacing * 2}px`,
      },
      textWithAction: {
        color: theme.colors.button.default.hoveredTextColor,
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
}
