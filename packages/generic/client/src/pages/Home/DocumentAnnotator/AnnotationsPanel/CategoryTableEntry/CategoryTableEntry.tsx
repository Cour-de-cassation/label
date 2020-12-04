import React from 'react';
import styled from 'styled-components';
import { uniq } from 'lodash';
import { displayModeType, fetchedAnnotationType, settingsModule } from '@label/core';
import { SText } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { customThemeType, emphasizeShadeColor, getColor, useCustomTheme, useDisplayMode } from '../../../../../styles';
import { splittedTextByLineType } from '../../lib';
import { entityEntryHandlerType } from '../useEntityEntryHandler';
import { CategoryTableEntryActionButtons } from './CategoryTableEntryActionButtons';

export { CategoryTableEntry };

const {
  Div_CategoryTableEntry,
  Div_EntityText,
  Div_Occurences,
  Div_ActionButtons,
  Div_AnnotationText,
} = buildStyledComponents();

function CategoryTableEntry(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  entityAnnotations: fetchedAnnotationType[];
  entityEntryHandler: entityEntryHandlerType;
  entityId: string;
  splittedTextByLine: splittedTextByLineType;
}) {
  const theme = useCustomTheme();
  const { displayMode } = useDisplayMode();
  const entityAnnotation = props.entityAnnotations[0];
  const entityAnnotationTexts = uniq(props.entityAnnotations.map((annotation) => annotation.text));
  const numberOfEntities = props.entityAnnotations.length;

  const styleProps = {
    annotatorStateHandler: props.annotatorStateHandler,
    category: entityAnnotation.category,
    displayMode: displayMode,
    entityEntryHandler: props.entityEntryHandler,
    entityId: props.entityId,
    theme: theme,
  };

  return (
    <Div_CategoryTableEntry key={props.entityId} onClick={selectEntity} styleProps={styleProps}>
      <Div_EntityText styleProps={styleProps}>
        {entityAnnotationTexts.map((text) => (
          <Div_AnnotationText styleProps={styleProps}>
            <SText variant="body2">{text}</SText>
          </Div_AnnotationText>
        ))}
      </Div_EntityText>
      <Div_Occurences styleProps={styleProps}>
        <SText>{numberOfEntities}</SText>
      </Div_Occurences>
      <Div_ActionButtons styleProps={styleProps}>
        <CategoryTableEntryActionButtons
          annotatorStateHandler={props.annotatorStateHandler}
          entityAnnotation={entityAnnotation}
          entityEntryHandler={props.entityEntryHandler}
        />
      </Div_ActionButtons>
    </Div_CategoryTableEntry>
  );

  function selectEntity() {
    props.entityEntryHandler.setSelected(
      props.entityEntryHandler.isSelected(props.entityId) ? undefined : props.entityId,
    );
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

  const Div_AnnotationText = styled.div<stylePropsType>`
    line-height: 14px;
    margin-bottom: ${({ styleProps }) => styleProps.theme.spacing / 2}px;
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
      padding: ${styleProps.theme.spacing}px ${styleProps.theme.spacing * 3}px;
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
        border-radius: ${styleProps.theme.shape.borderRadius.medium}px;
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
        display: inherit;
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
        border-radius: ${styleProps.theme.shape.borderRadius.medium}px;
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
