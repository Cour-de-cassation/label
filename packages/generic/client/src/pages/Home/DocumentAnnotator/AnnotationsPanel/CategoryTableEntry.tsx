import React from 'react';
import { uniq } from 'lodash';
import {
  ComponentsList,
  DeleteAnnotationButton,
  LayoutGrid,
  LinkAnnotationDropdown,
  Text,
  UnlinkAnnotationButton,
} from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { clientAnonymizerType } from '../../../../types';
import { entityEntryHandlerType } from './useEntityEntryHandler';

export { CategoryTableEntry };

const CATEGORY_TABLE_ENTRY_BUTTON_SIZE = 32;

function CategoryTableEntry(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
  entityId: string;
  entityEntryHandler: entityEntryHandlerType;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  const entityAnnotations = props.annotatorStateHandler
    .get()
    .annotations.filter((annotation) => annotation.entityId === props.entityId);
  const entityAnnotationTexts = uniq(entityAnnotations.map((annotation) => annotation.text));

  return shouldShowActionButtons() ? buildEntryWithAction() : buildEntry();

  function buildEntry() {
    return (
      <LayoutGrid
        container
        key={entityAnnotations[0].entityId}
        item
        justifyContent="space-between"
        onMouseEnter={() => showActionButtons(true)}
        style={styles.categoryTableEntry}
      >
        <LayoutGrid item style={styles.textCell} xs={8}>
          {entityAnnotationTexts.map((text) => (
            <Text variant="body2">{text}</Text>
          ))}
        </LayoutGrid>
        <LayoutGrid item style={styles.textCell} xs={3}>
          <Text style={styles.anonymizedText} variant="body2">
            {props.anonymizer.anonymize(entityAnnotations[0])}
          </Text>
        </LayoutGrid>
        <LayoutGrid item style={styles.textCell} xs={1}>
          <Text style={styles.occurencesNumber}>{entityAnnotations.length}</Text>
        </LayoutGrid>
      </LayoutGrid>
    );
  }

  function buildEntryWithAction() {
    return (
      <LayoutGrid
        container
        key={entityAnnotations[0].entityId}
        item
        justifyContent="space-between"
        onClick={() => props.entityEntryHandler.selectEntity(props.entityId)}
        onMouseLeave={() => showActionButtons(false)}
        style={styles.categoryTableEntryWithActions}
      >
        <LayoutGrid item style={styles.textCell} xs={8}>
          {entityAnnotationTexts.map((text) => (
            <Text style={styles.textWithAction} variant="body2">
              {text}
            </Text>
          ))}
        </LayoutGrid>
        <LayoutGrid item style={styles.actionCell} xs={4}>
          <ComponentsList
            components={[
              <LinkAnnotationDropdown
                annotatorStateHandler={props.annotatorStateHandler}
                annotation={entityAnnotations[0]}
                buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
                disabled={false}
                onClose={() => showActionButtons(false)}
              />,
              <UnlinkAnnotationButton
                annotatorStateHandler={props.annotatorStateHandler}
                annotation={entityAnnotations[0]}
                buttonSize={CATEGORY_TABLE_ENTRY_BUTTON_SIZE}
                disabled={false}
              />,
              <DeleteAnnotationButton
                annotatorStateHandler={props.annotatorStateHandler}
                annotation={entityAnnotations[0]}
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
  }

  function buildStyles(theme: customThemeType) {
    return {
      actionCell: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'flex-end',
        padding: `${theme.spacing / 2}px 0`,
      },
      anonymizedText: {
        fontStyle: 'italic',
      },
      categoryTableEntry: {
        borderRadius: theme.shape.borderRadius,
        paddingLeft: `${theme.spacing * 2}px`,
      },
      categoryTableEntryWithActions: {
        backgroundColor: theme.colors.button.default.hoveredBackground,
        borderRadius: theme.shape.borderRadius,
        cursor: 'pointer',
        paddingLeft: `${theme.spacing * 2}px`,
      },
      occurencesNumber: {
        textAlign: 'right',
        paddingRight: theme.spacing * 3,
      },
      textCell: {
        padding: `${theme.spacing}px 0`,
      },
      textWithAction: {
        color: theme.colors.button.default.hoveredTextColor,
      },
    } as const;
  }

  function shouldShowActionButtons() {
    return props.entityEntryHandler.getEntityFocused() === props.entityId;
  }

  function showActionButtons(isHovered: boolean) {
    return isHovered ? props.entityEntryHandler.focusEntity(props.entityId) : props.entityEntryHandler.unfocusEntity();
  }
}
