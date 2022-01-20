import React from 'react';
import styled from 'styled-components';
import { uniq } from 'lodash';
import {
  customThemeType,
  emphasizeShadeColor,
  getColor,
  useCustomTheme,
  useDisplayMode,
  Text,
} from 'pelta-design-system';
import { CategoryTableEntryBracketLink } from './CategoryTableEntryBracketLink';
import { displayModeType, annotationType, settingsModule } from '@label/core';
import { annotatorStateHandlerType, useAnnotatorStateHandler } from '../../../../../services/annotatorState';
import { useViewerScrollerHandler } from '../../../../../services/viewerScroller';
import { splittedTextByLineType } from '../../lib';
import { entityEntryHandlerType, useEntityEntryHandler } from '../useEntityEntryHandler';
import { CategoryTableEntryActionButtons } from './CategoryTableEntryActionButtons';

export { CategoryTableEntry };

const {
  Div_CategoryTableEntry,
  Div_EntityText,
  Div_Occurences,
  Div_ActionButtons,
  Div_AnnotationText,
  Div_AnnotationTextMargin,
} = buildStyledComponents();

function CategoryTableEntry(props: {
  entityAnnotations: annotationType[];
  entityId: string;
  splittedTextByLine: splittedTextByLineType;
}) {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const theme = useCustomTheme();
  const { displayMode } = useDisplayMode();
  const entityEntryHandler = useEntityEntryHandler({
    splittedTextByLine: props.splittedTextByLine,
    onResetViewerMode,
    onLeaveAnnotationMode,
  });
  const viewerScrollerHandler = useViewerScrollerHandler();
  const entityAnnotation = props.entityAnnotations[0];
  const entityAnnotationTexts = uniq(props.entityAnnotations.map((annotation) => annotation.text));
  const numberOfEntities = props.entityAnnotations.length;

  const styleProps = {
    annotatorStateHandler,
    category: entityAnnotation.category,
    displayMode: displayMode,
    entityEntryHandler,
    entityId: props.entityId,
    theme: theme,
  };
  return (
    <Div_CategoryTableEntry key={props.entityId} onClick={selectEntity} styleProps={styleProps}>
      <Div_EntityText styleProps={styleProps}>
        {entityAnnotationTexts.map((text, index) => (
          <div>
            <Div_AnnotationText styleProps={styleProps}>
              <CategoryTableEntryBracketLink
                color={computeBracketLinkColor(entityAnnotation.category)}
                variant={computeBracketPosition(entityAnnotationTexts, index)}
              />
              <Div_AnnotationTextMargin>
                <Text variant="body2" inline>
                  {text}
                </Text>
              </Div_AnnotationTextMargin>
            </Div_AnnotationText>
          </div>
        ))}
      </Div_EntityText>
      <Div_Occurences styleProps={styleProps}>
        <Text inline>{numberOfEntities}</Text>
      </Div_Occurences>
      <Div_ActionButtons styleProps={styleProps}>
        <CategoryTableEntryActionButtons entityAnnotation={entityAnnotation} entityEntryHandler={entityEntryHandler} />
      </Div_ActionButtons>
    </Div_CategoryTableEntry>
  );

  function computeBracketPosition(entityAnnotationTexts: string[], index: number) {
    if (entityAnnotationTexts.length > 1) {
      if (index === 0) {
        return 'first';
      } else if (index === entityAnnotationTexts.length - 1) {
        return 'last';
      } else {
        return 'middle';
      }
    } else {
      return 'empty';
    }
  }

  function computeBracketLinkColor(category: string) {
    if (entityEntryHandler.isSelected(props.entityId)) {
      return theme.colors.line.level1;
    } else {
      return getColor(
        settingsModule.lib.getAnnotationCategoryColor(category, annotatorStateHandler.get().settings, displayMode),
      );
    }
  }

  function onLeaveAnnotationMode() {
    viewerScrollerHandler.storeCurrentVerticalPosition();
  }

  function onResetViewerMode() {
    viewerScrollerHandler.scrollToStoredVerticalPosition();
  }

  function selectEntity() {
    const isEntitySelected = entityEntryHandler.isSelected(props.entityId);
    if (isEntitySelected) {
      entityEntryHandler.setSelected(undefined);
    } else {
      entityEntryHandler.setSelected(props.entityId);
    }
  }
}

function buildStyledComponents() {
  type stylePropsType = {
    styleProps: {
      annotatorStateHandler: annotatorStateHandlerType;
      category: string;
      displayMode: displayModeType;
      entityEntryHandler: entityEntryHandlerType;
      entityId: string;
      theme: customThemeType;
    };
  };
  const Div_AnnotationTextMargin = styled.div`
    margin-bottom: 4px;
  `;
  const Div_AnnotationText = styled.div<stylePropsType>`
    line-height: 14px;
    display: flex;
  `;
  const Div_EntityText = styled.div<stylePropsType>`
    ${({ styleProps }) => `
      padding: ${styleProps.theme.spacing}px ${styleProps.theme.spacing * 3}px;
      ${
        styleProps.entityEntryHandler.isFocused(styleProps.entityId)
          ? `
      color: ${styleProps.theme.colors.default.hoveredTextColor};
      `
          : ''
      }
    `}
  `;
  const Div_Occurences = styled.div<stylePropsType>`
    ${({ styleProps }) => `
      padding: 0 ${styleProps.theme.spacing * 3}px;
      ${
        styleProps.entityEntryHandler.isFocused(styleProps.entityId)
          ? `
      color: ${computeBackgroundColors(styleProps).hoveredBackgroundColor};
      `
          : ''
      }
    `}
  `;
  const Div_ActionButtons = styled.div<stylePropsType>`
    ${({ styleProps }) => {
      const { hoveredBackgroundColor } = computeBackgroundColors(styleProps);
      return `
        display: none;
        border-radius: ${styleProps.theme.shape.borderRadius.m}px;
        background: linear-gradient(to left, ${hoveredBackgroundColor}, 75%,transparent);
        padding-left: 50%;
        height: 100%;
        position: absolute;
        top: 50%;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        right: 0;
        ${
          styleProps.entityEntryHandler.isFocused(styleProps.entityId)
            ? `
            display: flex;
            align-items: center;
          `
            : ''
        }
      `;
    }}
  `;
  const Div_CategoryTableEntry = styled.div<stylePropsType>`
    ${({ styleProps }) => {
      const { backgroundColor, hoveredBackgroundColor } = computeBackgroundColors(styleProps);

      return `
        background-color: ${backgroundColor};
        border-radius: ${styleProps.theme.shape.borderRadius.m}px;
        position: relative;
        display: flex;
        justify-content: space-between;
        ${
          styleProps.entityEntryHandler.isFocused(styleProps.entityId)
            ? `
        background-color: ${hoveredBackgroundColor};
        cursor: pointer;
        `
            : ''
        }
        &:hover {
          background-color: ${hoveredBackgroundColor};
          cursor: pointer;
        }

        &:hover ${Div_EntityText} {
          color: ${styleProps.theme.colors.default.hoveredTextColor};
        }

        &:hover ${Div_Occurences} {
          color: ${hoveredBackgroundColor};
        }

        &:hover ${Div_ActionButtons} {
          display: flex;
          align-items: center;
        }`;
    }}
  `;

  return {
    Div_CategoryTableEntry,
    Div_EntityText,
    Div_Occurences,
    Div_ActionButtons,
    Div_AnnotationText,
    Div_AnnotationTextMargin,
  };

  function computeBackgroundColors(props: {
    annotatorStateHandler: annotatorStateHandlerType;
    category: string;
    displayMode: displayModeType;
    entityEntryHandler: entityEntryHandlerType;
    entityId: string;
    theme: customThemeType;
  }) {
    if (props.entityEntryHandler.isSelected(props.entityId)) {
      const shadeColor = settingsModule.lib.getAnnotationCategoryColor(
        props.category,
        props.annotatorStateHandler.get().settings,
        props.displayMode,
      );
      return {
        backgroundColor: getColor(shadeColor),
        hoveredBackgroundColor: emphasizeShadeColor(shadeColor, props.displayMode),
      };
    } else {
      return {
        backgroundColor: props.theme.colors.default.background,
        hoveredBackgroundColor: props.theme.colors.default.hoveredBackground,
      };
    }
  }
}
